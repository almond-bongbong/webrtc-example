import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use('/public', express.static(`${__dirname}/public`));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const server = http.createServer(app);
const io = SocketIO(server);

io.on('connection', (socket) => {
  socket.on('enter_room', (data, done) => {
    console.log(data);
    socket.join(data.payload);
    done('Joined room');
  });
});

// const sockets = [];
//
// wss.on('connection', (socket) => {
//   console.log('Connected to Browser ✅');
//   sockets.push(socket);
//
//   socket.on('close', () => console.log('Disconnected from Browser ❌'));
//   socket.on('message', (message) => {
//     const parsedMessage = JSON.parse(message);
//
//     switch (parsedMessage.type) {
//       case 'new_message':
//         sockets.forEach((s) => {
//           s.send(`${socket.nickname || 'anonymous'}: ${parsedMessage.payload}`);
//         });
//         break;
//
//       case 'nickname':
//         socket.nickname = parsedMessage.payload;
//         break;
//     }
//   });
// });

server.listen(3000, () => console.log('🚀 Server started on :3000'));
