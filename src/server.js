import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

// fs and https 모듈 가져오기
import * as fs from 'fs';
import * as https from 'https';

const options = {
  key: fs.readFileSync('cert.key'),
  cert: fs.readFileSync('cert.crt'),
};

const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use('/public', express.static(`${__dirname}/public`));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

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

function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size ?? 0;
}

io.on('connection', (socket) => {
  socket.nickname = 'Anonymous';
  io.sockets.emit('room_change', { payload: { rooms: publicRooms() } });

  // for log
  socket.onAny((event) => {
    console.log('socket event', event);
  });

  socket.on('enter_room', (data, done) => {
    const { roomName, nickname } = data.payload;
    socket.nickname = nickname;
    socket.join(roomName);
    done?.();
    socket.to(roomName).emit('welcome', {
      payload: { nickname, roomCount: countRoom(roomName) },
    });
    io.sockets.emit('room_change', {
      payload: { rooms: publicRooms() },
    });
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
      socket.to(room).emit('bye', {
        payload: { nickname: socket.nickname, roomCount: countRoom(room) - 1 },
      });
    });
  });

  socket.on('disconnect', () => {
    io.sockets.emit('room_change', { payload: { rooms: publicRooms() } });
  });
});

server.listen(3000, () => console.log('🚀 Server started on :3000'));

const httpsServer = https.createServer(options, app);
const io2 = new Server(httpsServer);
httpsServer.listen(3333, () => console.log('🚀 Server started on :3333'));
