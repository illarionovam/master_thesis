import express from 'express';
import apiRouter from './routes/index.js';
import controllerWrapper from './decorators/controllerWrapper.js';
import { handleErrors } from './middlewares/handleErrors.js';

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000;

app.use('/api', controllerWrapper(apiRouter));

app.use(handleErrors);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});
