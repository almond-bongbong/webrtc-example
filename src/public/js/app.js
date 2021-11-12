const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');

const makeMessage = (type, payload) =>
  JSON.stringify({
    type,
    payload,
  });

socket.addEventListener('open', () => console.log('Connected to Server ✅'));

socket.addEventListener('close', () =>
  console.log('Disconnected from Server ❌')
);

socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

setTimeout(() => {
  socket.send('hello from the browser!');
}, 10 * 1000);

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMessage('message', input.value));
  input.value = '';
});

nickForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
});
