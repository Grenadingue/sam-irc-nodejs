function initSocketIo(io, orm, rootFolder)
{
  const ircController = require(rootFolder + '/controllers/irc.js');
  const helloCluster = require(rootFolder + '/controllers/helloCluster.js');

  helloCluster.init(rootFolder, 8000, rootFolder + '/cpp/hello.js');

  io.on('connection', function (socket) {
    var currentUser = null;

    socket.on('identification', function (data) {
      orm.Users.findOne({ where: { id: data.userid } })
        .then(function (user) {
          if (user) {
            currentUser = user;
            console.log('User identified = ' + user.username + ' | ' + user.id);
            socket.emit('passport', { username: user.username, userid: user.id });
            if (!user.active) {
              io.emit('notification', '[21:21] Notification: ' + user.username + ' is now connected');
              user.active = true;
              user.save();
              helloCluster.work(socket, 'notification');
            }
          } else {
            console.log('Fuck, user not found !');
          }
        }
      );
    });

    socket.on('disconnect', function (data) {
      ircController.disconnectUser(currentUser, io);
    });

    socket.on('user_input', function (data) {
      ircController.processUserInput(io, socket, data, currentUser);
    });

    io.emit('identification', {});
  });
}

module.exports = initSocketIo;
