const io = require('socket.io')(8000, {
  cors: {
    origin: '*',  // exact frontend origin here
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', socket => {
  socket.on('new-user-joined', name => {
   // console.log("New user :", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
 
  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('typing', ()=>{
    socket.broadcast.emit('displayTyping', users[socket.id]);
  });

  socket.on('stoptyping', ()=>{
    socket.broadcast.emit('hideTyping');
  });

  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

