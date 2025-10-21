import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { handleErrors } from './middlewares/handleErrors.js';
import { initModels } from './db/initModels.js';

await initModels();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.use(handleErrors);

export default app;
