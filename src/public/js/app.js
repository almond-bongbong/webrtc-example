const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');

socket.addEventListener('open', () => console.log('Connected to Server ✅'));

socket.addEventListener('close', () =>
  console.log('Disconnected from Server ❌')
);

socket.addEventListener('message', (message) => {
  messageList.append(message.data);
});

setTimeout(() => {
  socket.send('hello from the browser!');
}, 10 * 1000);

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(input.value);
  input.value = '';
});
