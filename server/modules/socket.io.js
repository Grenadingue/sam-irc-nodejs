function initSocketIo(io, orm, rootFolder)
{
  const ircController = require(rootFolder + '/controllers/irc.js');

  io.on('connection', function (socket) {
    var currentUser = null;

    io.emit('identification', {});

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
            }
          } else {
            console.log('Fuck, user not found !');
          }
        }
      );
    });

    socket.on('disconnect', function (data) {
      currentUser.active = false;
      currentUser.save();
      io.emit('notification', '[21:21] Notification: ' + currentUser.username + ' is now disconnected');
    });

    socket.on('user_input', function (data) {
      ircController.processUserInput(io, socket, data, currentUser);
    });
  });
}

module.exports = initSocketIo;
