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

function publicRooms() {
  const { sids, rooms } = io.sockets.adapter;
  const publicRooms = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) == null) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
}

io.on('connection', (socket) => {
  socket.nickname = 'Anonymous';

  // for log
  socket.onAny((event) => {
    console.log('socket event', event);
  });

  socket.on('enter_room', (data, done) => {
    const { roomName, nickname } = data.payload;
    socket.nickname = nickname;
    socket.join(roomName);
    done();
    socket.to(roomName).emit('welcome', { payload: { nickname } });
    io.sockets.emit('room_change', { payload: { rooms: publicRooms() } });
  });

  socket.on('new_message', ({ payload }, done) => {
    const { message, roomName } = payload;
    socket
      .to(roomName)
      .emit('new_message', { payload: { nickname: socket.nickname, message } });
    done?.();
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('bye');
    });
  });

  socket.on('disconnect', () => {
    io.sockets.emit('room_change', { payload: { rooms: publicRooms() } });
  });
});

server.listen(3000, () => console.log('🚀 Server started on :3000'));
