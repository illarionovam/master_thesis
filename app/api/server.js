import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { handleErrors } from './middlewares/handleErrors.js';
import { sequelize } from './db/db.js';
import { initModels } from './db/initModels.js';

await initModels();

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.use(handleErrors);

try {
    await sequelize.authenticate();
} catch (err) {
    console.error(`Unable to connect to the database: ${err.message}.`);
    process.exit(1);
}

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});
