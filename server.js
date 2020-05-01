const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('join', (login) => {
        console.log(login.user + ' joined chat!');
        users.push(login);
        socket.broadcast.emit('newUser', {
            author: "Chat Bot",
            content: '<i><b>' + login.user + ' </b><i>has joined the conversation!</i>',
        });
    });
    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left')
        const item = users.find(item => item.id == socket.id);
        const index = users.indexOf(item);
        const login = users.filter(item => item.id == socket.id);

        users.splice(index, 1);
        socket.broadcast.emit('removeUser', {
            author: "Chat Bot",
            content: '<i><b>' + login[0].user + ' </b><i>has left the conversation... :(</i>',
        });
    });
    console.log('I\'ve added a listener on message and disconnect events \n');
});