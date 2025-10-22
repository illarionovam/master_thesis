const path = require('node:path');
const { config } = require('dotenv');

config({ path: path.resolve(process.cwd(), '.env.test') });

let sequelize;

beforeAll(async () => {
    const dbMod = await import('../../db/db.js');
    sequelize = dbMod.sequelize;

    const { initModels } = await import('../../db/initModels.js');
    await initModels();

    await sequelize.authenticate();
    await sequelize.sync({ force: true });
});

afterEach(async () => {
    const qi = sequelize.getQueryInterface();
    const tables = await qi.showAllTables();
    const toTruncate = tables.filter(t => t !== 'SequelizeMeta');
    for (const t of toTruncate) {
        await sequelize.query(`TRUNCATE TABLE "${t}" RESTART IDENTITY CASCADE;`, { logging: false });
    }
});

afterAll(async () => {
    await sequelize.close();
});
