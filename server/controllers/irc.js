require('date-format-lite');

// Hours + Minutes in a formatted string
function time() {
  const now = new Date();

  return (now.format('[hh:mm]'));
}

// Sending functions
function sendNotification(socket, message) {
  socket.emit('notification', time() + ' Notification: ' + message);
}

function sendUserMessage(socket, data, user) {
  socket.emit('user_input', time() + ' ' + user.username + ': ' + data);
}

// Available user commands '/something' and their bindings
const userCommands = {
  '/?': helpCommand,
  '/help': helpCommand,
  '/toto': totoCommand,
  '/foobar': foobarCommand,
  '/private': privateCommand,
  '/public': publicCommand,
};

// User commands declaration
userCommands.unknownCommand = function (words, socket, io) {
  sendNotification(socket, 'Unknown command');
};

function helpCommand(words, socket, io) {
  sendNotification(socket, 'Help message');
}

function totoCommand(words, socket, io) {
  sendNotification(socket, 'C\'est toto qui pete dans sa combinaison de cosmonaute et il s\'evanouit. Ha Ha. Trop de lol dans l\'air.');
}

function foobarCommand(words, socket, io) {
  sendNotification(socket, 'Foo ! Baaaaaaar ! BAAAAAAAAAAZZZZ ! Voila');
}

function privateCommand(words, socket, io) {
  sendNotification(socket, 'Private command, non effective');
}

function publicCommand(words, socket, io) {
  sendNotification(socket, 'Public command, non effective');
}

// Find user command and process it
function processUserCommand(socket, io, words, user) {
  const userCommand = userCommands[words[0]];

  if (userCommand) {
    userCommand(socket, io, words);
  } else {
    userCommands.unknownCommand(socket, io, words);
  }
}

// Find is user input is a command and process it
module.exports.processUserInput = function (io, socket, data, user) {
  const words = data.split(' ').filter(function isNotEmpty(currentValue) {
    return (currentValue !== '');
  });

  console.log(words);
  if (words[0] && words[0][0] == '/') {
    processUserCommand(socket, io, words, user);
  } else if (words[0]) {
    sendUserMessage(io, data, user);
  }
};

// Connect a user
module.exports.connectUser = function (socket, io, orm, user, helloCluster) {
  console.log('|| username = ' + user);
  orm.Users.findOne({ where: { id: user.id } })
  .then(function (foundUser) {
    if (foundUser) {
      user.model = foundUser;
      console.log('User identified = ' + user.model.username + ' | ' + user.model.id);
      socket.emit('passport', { id: user.model.id, name: user.model.username });
      if (!user.model.active) {
        sendNotification(io, user.username + ' is now connected');
        user.model.active = true;
        user.model.save();
        helloCluster.work(socket, 'notification');
      }
    } else {
      console.log('Fuck, user not found !');
    }
  });
};

// Disconnect a user
module.exports.disconnectUser = function (io, user) {
  user.model.active = false;
  user.model.save();
  sendNotification(io, user.model.username + ' is now disconnected');
};
