let socket;
const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMessage('new_message', input.value));
  input.value = '';
});

nickForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
});

const makeMessage = (type, payload) =>
  JSON.stringify({
    type,
    payload,
  });

function initWebsocket() {
  socket = new WebSocket(`ws://${window.location.host}`);

  socket.addEventListener('open', () => console.log('Connected to Server ✅'));

  socket.addEventListener('close', () => {
    console.log('Disconnected from Server ❌');
    console.log('Retrying connection after 2s');

    setTimeout(() => {
      initWebsocket();
    }, 2200);
  });

  socket.addEventListener('message', (message) => {
    const li = document.createElement('li');
    li.innerText = message.data;
    messageList.append(li);
  });
}

initWebsocket();
