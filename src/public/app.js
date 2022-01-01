const socket = new WebSocket(`ws://${window.location.host}`);

const nicknameForm = document.querySelector('#nicknameForm');
const nicknameInput = nicknameForm.querySelector('input');
const messageForm = document.querySelector('#messageForm');
const messageInput = messageForm.querySelector('input');
const ul = document.querySelector('ul');
nicknameInput.focus();
let nickname;
messageForm.hidden = true;

socket.addEventListener('open', (e) => {
  console.log(`WebSocket is Connected to Server`);
});

socket.addEventListener('close', (e) => {
  console.log(`Websocket is closed`);
});

socket.addEventListener('message', (message) => {
  const data = JSON.parse(message.data);
  const li = document.createElement('li');
  if (data.type === 'nickname') {
    li.innerText = data.payload;
    li.style = 'color:cornflowerblue';
    ul.append(li);
    return;
  }
  if (data.type === 'message') {
    if (nickname === data.nickname) {
      li.innerText = `me : ${data.payload}`;
      li.style = 'color:gray';
    } else {
      li.innerText = `${data.nickname} : ${data.payload}`;
      li.style = 'color:tomato';
    }
    ul.append(li);
  }
});

const handleNickname = (e) => {
  e.preventDefault();
  nickname = nicknameInput.value;
  socket.send(JSON.stringify({ type: 'nickname', payload: nickname }));
  const h2 = document.querySelector('h2');
  h2.innerHTML = `Welcome ${nickname}`;
  messageInput.focus();
  nicknameForm.remove();
  messageForm.hidden = false;
};

const handleMessage = (e) => {
  e.preventDefault();
  const message = messageInput.value;
  socket.send(JSON.stringify({ type: 'message', payload: message }));
  messageInput.focus();
  messageInput.value = '';
};

nicknameForm.addEventListener('submit', handleNickname);
messageForm.addEventListener('submit', handleMessage);
