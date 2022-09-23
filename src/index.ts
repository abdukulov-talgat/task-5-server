import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './models/repository';
import { addMessageApi } from './services/messageApi';
import path from 'path';

const PORT = Number(process.env.SERVER_PORT) || 3000;
const app = express();

app.use(cors());
app.use('/static', express.static(path.resolve(__dirname, 'static')));
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './static/index.html'));
});
app.get('*', (req, res) => {
    res.redirect('/');
});

const server = addMessageApi(app);

const start = async () => {
    try {
        await initDatabase();

        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();
