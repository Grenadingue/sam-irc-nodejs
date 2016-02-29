function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}

function initSocketIo(io, orm, passportSocketIo, cookieParser, rootFolder)
{
  const helloCluster = require(rootFolder + '/controllers/helloCluster.js');
  const ircController = require(rootFolder + '/controllers/irc.js');

  ircController.passportSocketIo = passportSocketIo;
  helloCluster.init(rootFolder, 8000, rootFolder + '/cpp/hello.js');

  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'sid',
    secret: 'trololo cat',
    store: orm.store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
  }));

  io.on('connection', function (socket) {
    const user = socket.request.user;

    socket.on('disconnect', function (data) {
      ircController.disconnectUser(io, user);
    });

    socket.on('user message', function (data) {
      ircController.processUserInput(io, socket, data, user, orm);
    });

    ircController.connectUser(socket, io, orm, user, helloCluster);
  });
}

module.exports = initSocketIo;
