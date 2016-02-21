const io = require('socket.io')(process.argv[2]);
const helloCppAddon = require(process.argv[3]);

io.on('connection', function (socket) {
  socket.on('work', function (data) {
    socket.emit('job done', helloCppAddon.hello());
  });
});
