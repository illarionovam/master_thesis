import express from 'express';

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});
