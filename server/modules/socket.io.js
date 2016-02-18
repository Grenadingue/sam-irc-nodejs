function initSocketIo(io)
{
  io.on('connection', function (socket) {
    console.log('user connected');
    socket.emit('notification', 'client connected');
    console.log('connected notification sent');

    socket.on('disconnect', function (data) {
      socket.emit('notification', 'client disconnected');
      console.log('user disconnected');
    });

    socket.on('chat message', function (data) {
      socket.emit('chat message', 'User: ' + data);
      console.log('user sent message = ' + data);
    });
  });
}

module.exports = initSocketIo;
