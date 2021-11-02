const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => console.log('Connected to Server ✅'));

socket.addEventListener('close', () =>
  console.log('Disconnected from Server ❌')
);

socket.addEventListener('message', (message) => {
  console.log('New message =>', message.data);
});

setTimeout(() => {
  socket.send('hello from the browser!');
}, 10 * 1000);
