require('date-format-lite');

// Channels instanciation
const channels = {};
const defaultChannel = 'public';

channels[defaultChannel] = {
  name: defaultChannel,
  users: [],
};

// Available user commands '/something' and their bindings
const userCommands = {
  '/?': helpCommand,
  '/help': helpCommand,
  '/toto': totoCommand,
  '/foobar': foobarCommand,
  '/private': privateCommand,
  '/public': publicCommand,
};

// Hours + Minutes in a formatted string
function time() {
  const now = new Date();

  return (now.format('[hh:mm]'));
}

// Sending functions
function sendNotification(socket, channel, message) {
  socket.emit('notification', { channel: channel, message: time() + ' Notification: ' + message });
}

function sendUserMessage(io, channel, message, user) {
  if (channel !== 'public') {
    io.sockets.in(channel).emit('user message', { channel: channel, message: time() + ' ' + user.username + ': ' + message });
  } else {
    io.emit('user message', { channel: channel, message: time() + ' ' + user.username + ': ' + message });
  }
}

// User commands declaration
userCommands.unknownCommand = function (socket, io, words, channel, user, orm) {
  sendNotification(socket, channel, 'Unknown command');
};

function helpCommand(socket, io, words, channel, user, orm) {
  sendNotification(socket, channel, 'Available commands: /toto | /foobar | /private #username | /public | /help or /?');
}

function totoCommand(socket, io, words, channel, user, orm) {
  sendNotification(socket, channel, 'C\'est toto qui pete dans sa combinaison de cosmonaute et il s\'evanouit. Ha Ha. Trop de lol dans l\'air.');
}

function foobarCommand(socket, io, words, channel, user, orm) {
  sendNotification(socket, channel, 'Foo ! Baaaaaaar ! BAAAAAAAAAAZZZZ ! Voila');
}

function privateCommand(socket, io, words, channel, user, orm) {
  const peerUsername = words[1];

  if (peerUsername) {
    if (peerUsername == user.username) {
      sendNotification(socket, channel, 'You don\'t need a private channel to talk to yourself');
    } else {
      orm.Users.findByUsername(peerUsername)
      .then(function (peerUser) {
        if (peerUser) {
          if (!peerUser.active) {
            sendNotification(socket, channel, peerUser.username + ' is currently not active, abort');
          } else {
            const users = [user.username, peerUser.username].sort();
            const channelName = users[0] + '#' + users[1];
            const channel = channels[channelName];

            if (channel) { // channel exists, just join it
              if (channel.users.indexOf(user.id) == -1) { // user not yet in private channel
                channel.users.push(user.id);
                socket.join(channelName);
                socket.emit('new channel', { channel: channelName });
                sendNotification(socket, channelName, 'Type /public to temporary get back to public channel');
                sendNotification(socket, channelName, 'Connection established with ' + peerUsername);
                module.exports.passportSocketIo.filterSocketsByUser(io, function (user) { // check that the receiver user is still connected
                  return (user.username == peerUsername);
                }).forEach(function (receiverSocket) { // theoretically only one user, one for loop
                  sendNotification(receiverSocket, channelName, 'Connection established with ' + user.username);
                });
              }

              socket.emit('show channel', { channel: channelName });
            } else { // first user create and enter in private channel
              module.exports.passportSocketIo.filterSocketsByUser(io, function (user) { // check that the receiver user is still connected
                return (user.username == peerUsername);
              }).forEach(function (receiverSocket) { // theoretically only one user, one for loop
                socket.join(channelName);
                channels[channelName] = { name: channelName, users: [user.id] };
                sendNotification(receiverSocket, 'public', 'User ' + user.username + ' would like to enter in a private discussion with you, type /private ' + user.username + ' to enter the chat');
                socket.emit('new channel', { channel: channelName });
                socket.emit('show channel', { channel: channelName });
                sendNotification(socket, channelName, 'Type /public to temporaly get back to public channel');
                sendNotification(socket, channelName, 'A request has been sent to ' + peerUser.username);
              });
            }
          }
        } else {
          sendNotification(socket, channel, 'User ' + peerUsername + ' doesn\'t exists');
        }
      });
    }
  }
}

function publicCommand(socket, io, words, channel, user, orm) {
  socket.emit('show channel', { channel: 'public' });
  if (channel != defaultChannel) {
    sendNotification(socket, defaultChannel, 'Type /private #username to return back to the private discussion');
  }
}

// Find user command and process it
function processUserCommand(socket, io, words, channel, user, orm) {
  const userCommand = words[0];
  const userCommandFunction = userCommands[userCommand];

  if (userCommandFunction) {
    userCommandFunction(socket, io, words, channel, user, orm);
  } else {
    userCommands.unknownCommand(socket, io, words, channel, user, orm);
  }
}

// Find is user input is a command and process it
module.exports.processUserInput = function (io, socket, data, user, orm) {
  const channel = data.channel;
  const words = data.message.split(' ').filter(function isNotEmpty(currentValue) {
    return (currentValue !== '');
  });

  console.log(words);
  if (words[0] && words[0][0] == '/') {
    processUserCommand(socket, io, words, channel, user, orm);
  } else if (words[0]) {
    sendUserMessage(io, channel, data.message, user);
  }
};

// Connect a user
module.exports.connectUser = function (socket, io, orm, user, helloCluster) {
  orm.Users.findById(user.id)
  .then(function (foundUser) {
    if (foundUser) {
      user.model = foundUser;
      socket.emit('passport', { id: user.model.id, name: user.model.username });
      if (!user.model.active) {
        socket.emit('new channel', { channel: 'public', username: user.username });
        socket.emit('show channel', { channel: 'public', username: user.username });

        sendNotification(io, 'public', user.username + ' is now connected');
        helpCommand(socket, null, null, 'public');
        user.model.active = true;
        user.model.save();
        helloCluster.work(socket, 'notification');
      }
    } else {
      console.log('Oups, user not found !');
    }
  });
};

// Disconnect a user
module.exports.disconnectUser = function (io, user) {
  user.model.active = false;
  user.model.save();
  sendNotification(io, 'public', user.model.username + ' is now disconnected');
};
