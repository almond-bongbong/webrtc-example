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
  // for log
  socket.onAny((event) => {
    console.log('socket event', event);
  });

  socket.on('enter_room', (data, done) => {
    const roomName = data.payload;
    socket.join(roomName);
    done();
    io.to(roomName).emit('welcome');
  });

  socket.on('new_message', ({ payload }, done) => {
    const { message, roomName } = payload;
    socket.to(roomName).emit('new_message', { payload: { roomName, message } });
    done?.();
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('bye');
    });
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
