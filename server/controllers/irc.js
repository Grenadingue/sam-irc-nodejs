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

function sendUserMessage(socket, data, currentUser) {
  socket.emit('user_input', time() + ' ' + currentUser.username + ': ' + data);
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
function processUserCommand(socket, io, words, currentUser) {
  const userCommand = userCommands[words[0]];

  if (userCommand) {
    userCommand(socket, io, words);
  } else {
    userCommands.unknownCommand(socket, io, words);
  }
}

// Find is user input is a command and process it
module.exports.processUserInput = function (io, socket, data, currentUser) {
  const words = data.split(' ').filter(function isNotEmpty(currentValue) {
    return (currentValue !== '');
  });

  console.log(words);
  if (words[0] && words[0][0] == '/') {
    processUserCommand(socket, io, words, currentUser);
  } else if (words[0]) {
    sendUserMessage(io, data, currentUser);
  }
};

// Disconnect a user
module.exports.disconnectUser = function (currentUser, io) {
  currentUser.active = false;
  currentUser.save();
  sendNotification(io, currentUser.username + ' is now disconnected');
};
