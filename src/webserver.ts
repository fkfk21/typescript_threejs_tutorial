import { Express, Request, Response } from 'express';
import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app: Express = express();
const port = 5050;

const wss: WebSocket.Server = new WebSocket.Server({ port: 5051 });


app.use(express.static('dist'));
app.use(express.json());

interface BoxDimensions {
    width: number;
    height: number;
    depth: number;
}

let boxDimensions: BoxDimensions = { width: 1, height: 1, depth: 1 }; // デフォルトの寸法

wss.on('open', () => {
    console.log('WebSocket is connected.');
});
wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected', ws.url);
    ws.on('message', (message: string) => {
        console.log('received: %s', message);
    });
    ws.send(JSON.stringify(boxDimensions));
});



app.post('/box', (req, res) => {
    console.log(req.body);
    boxDimensions = req.body;
    wss.clients.forEach(client => {
        console.log(client.url);
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(boxDimensions));
        }
    });
    res.status(200).send('Box dimensions received')
});

app.get('/box', (req, res) => {
    res.json(boxDimensions);
});

// index.html を返す
app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
