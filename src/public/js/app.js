const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;
let roomName = '';

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = event.target.querySelector('input');
  addMessage(`You: ${input.value}`);
  socket.emit('new_message', {
    payload: {
      message: input.value,
      roomName,
    },
  });
  input.value = '';
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `You are in room ${roomName}`;
  const msgForm = room.querySelector('#msg');
  msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const inputRoom = event.target.querySelector('#room_name');
  const inputNickname = event.target.querySelector('#nickname');

  socket.emit(
    'enter_room',
    {
      payload: {
        roomName: inputRoom.value,
        nickname: inputNickname.value,
      },
    },
    showRoom
  );

  roomName = inputRoom.value;
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', ({ payload }) => {
  addMessage(`${payload.nickname} has joined the room`);
});

socket.on('bye', () => {
  addMessage('Bye bye!');
});

socket.on('new_message', ({ payload }) => {
  addMessage(`${payload.nickname}: ${payload.message}`);
});

socket.on('room_change', ({ payload }) => {
  const { rooms } = payload;
  const ul = welcome.querySelector('ul');
  ul.innerHTML = '';
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    ul.appendChild(li);
  });
});
