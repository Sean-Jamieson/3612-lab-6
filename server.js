const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {origins: 'localhost:8080',}
});

const port = 8080;
let users = [];
io.on('connection', socket => {
  console.log(`a user connected on ${socket.id}`);
  socket.on('join', username => {
    let randNum = Math.floor(Math.random() * (70)) + 1;
    users.push({username:username, id:randNum}); 
    socket.username = username;
    io.emit('user joined', username)
    io.emit('user list', users);
  });
  socket.on('new chat msg', msg => {
    io.emit('chat msg for all', {msg:msg, username:socket.username});
  });
  socket.on('user left', () =>{
    for(let i = 0; i < users.length; i++){
      if(users[i].username == socket.username){
        users.splice(i, 1);
      }
    }
    io.emit('user list', users);
    io.emit('user left', socket.username);
  });
  socket.on('disconnect',  () => {
    for(let i = 0; i < users.length; i++){
      if(users[i].username == socket.username){
        users.splice(i, 1);
      }
    }
    io.emit('user list', users);
    io.emit('user left', socket.username);
  });
});

server.listen(port, () =>{
  console.log("server running on port: " + port);
});
