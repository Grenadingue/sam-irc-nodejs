const io = require('socket.io')(8000);

io.on('connection', function (socket) {
  socket.on('work', function (data) {
    socket.emit('job done', 'Notification: 42 is the answer');
  });
});
