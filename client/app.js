const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const socket = io();

let userName;

const login = (e) => {
    e.preventDefault();
    if (!userNameInput.value) {
        window.alert("Login is empty!");
    } else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('join', {
            id: socket.id,
            user: userName
        });
    }
}

const sendMessage = (e) => {
    e.preventDefault();
    if (!messageContentInput.value) {
        window.alert("Write something!");
    } else {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', {
            author: userName,
            content: messageContentInput.value
        });
        messageContentInput.value = "";
    }
}

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (author === userName) {
        message.classList.add('message--self')
    }
    message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
    messagesList.appendChild(message);
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

socket.on('message', ({
    author,
    content
}) => addMessage(author, content));

socket.on('newUser', ({
    author,
    content
}) => addMessage(author, content));

socket.on('removeUser', ({
    author,
    content
}) => addMessage(author, content));