import 'dotenv/config';
import { sequelize } from './db/db.js';
import app from './app.js';

const SERVER_PORT = process.env.SERVER_PORT || 3000;

try {
    await sequelize.authenticate();
} catch (err) {
    console.error(`Unable to connect to the database: ${err.message}.`);
    process.exit(1);
}

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});
