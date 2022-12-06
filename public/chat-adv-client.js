const socket = io("http://localhost:8080");
document.addEventListener("DOMContentLoaded", function () {
  const users  = document.querySelector('#users ul');
  const messages = document.querySelector('.messages-body ul');

  function getDateTime() {
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
  };
  function writeMessage(local, msg) {
    const li = document.createElement('li');
    const user = document.createElement('p');
    const content = document.createElement('p');
    const span = document.createElement('span');
    user.textContent = msg.username;
    user.classList.add('message-data');
    span.textContent = getDateTime();
    user.appendChild(span);
    content.textContent = msg.msg;
    content.classList.add('message-text');
    li.appendChild(user);
    li.appendChild(content);
    li.classList.add(local);
    messages.appendChild(li);
  };
  function userAction(action, username) {
    const li = document.createElement('li');
    const user = document.createElement('p');
    const content = document.createElement('p');
    user.textContent = username;
    user.classList.add('message-data');
    content.textContent = action;
    content.classList.add('message-text');
    li.appendChild(user);
    li.appendChild(content);
    li.classList.add('message-user');
    messages.appendChild(li);
  }
  // get user name and then tell the server
  let username = prompt('What\'s your username?');  
  socket.emit("join", username);
  socket.on('user joined', username => {
    userAction('Has Joined', username)
  });
  socket.on('user list', userList =>{
    users.innerHTML = '';
    for(let user of userList){
      const li = document.createElement('li');
      const name = document.createElement('div');
      const p1 = document.createElement('p');
      const p2 = document.createElement('p');
      const img = document.createElement('img');
      console.log(user.id);
      img.src = `https://randomuser.me/api/portraits/med/men/${user.id}.jpg`;
      p1.textContent = user.username;
      p2.textContent = "online";
      name.classList.add('name');
      name.appendChild(p1);
      name.appendChild(p2);
      li.appendChild(img);
      li.appendChild(name);
      users.appendChild(li);
    }
  })
  socket.on('chat msg for all', data => {
    if(username != data.username){
      writeMessage('message-received',data);
    }
  });
  /* This user is sending a new chat message */
  document.querySelector("#chatForm").addEventListener('submit', e => {
    e.preventDefault();
    const entry = document.querySelector("#entry");
    socket.emit('new chat msg', entry.value);
    writeMessage('message-sent', {msg:entry.value, username:username});
    entry.value = '';
  });

  /* User has clicked the leave button */
  document.querySelector("#leave").addEventListener('click', e => {
    e.preventDefault();
    socket.emit('user left');
    document.querySelector('.chat').classList.add('hidden');
  }); 
  socket.on('user left', username => {
    userAction('Has Left', username);
  });



  

});

