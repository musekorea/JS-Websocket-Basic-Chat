import http from 'http';
import { WebSocketServer } from 'ws';
import express, { json } from 'express';

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const websocketServer = new WebSocketServer({ server: httpServer });

const allSockets = [];

websocketServer.on('connection', (socket) => {
  allSockets.push(socket);
  socket.nickname = 'anonymous';
  console.log(`Websocket is connected to Browswer`);
  socket.on('close', () => {
    console.log(`Websocket is disconneted`);
  });
  socket.on('message', (message) => {
    const messageJSON = message.toString('utf-8');
    const messageObj = JSON.parse(messageJSON);
    if (messageObj.type === 'message') {
      messageObj.nickname = socket.nickname;
      allSockets.forEach((eachSocket) => {
        eachSocket.send(JSON.stringify(messageObj));
      });
    } else if (messageObj.type === 'nickname') {
      socket.nickname = messageObj.payload;
      allSockets.forEach((eachScoket) => {
        eachScoket.send(
          JSON.stringify({
            type: 'nickname',
            payload: `${socket.nickname} is joined 🙏`,
          })
        );
      });
    }
  });
});

httpServer.listen(8080, handleListen);
