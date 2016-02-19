function broadcastUserMessage(io, data, currentUser) {
  io.emit('user_input', '[21:21] ' + currentUser.username + ': ' + data);
}

// Raw irc commands for testing purpose
function processUserCommand(socket, words, currentUser) {
  switch (words[0]) {
    case '/toto':
      socket.emit('notification', '[21:21] Notification: C\'est toto qui pete dans sa combinaison de cosmonaute et il s\'evanouit. Ha Ha. Trop de lol dans l\'air.');
      break;
    case '/foobar':
      socket.emit('notification', '[21:21] Notification: Foo ! Baaaaaaar ! BAAAAAAAAAAZZZZ ! Voila');
      break;
    default:
      socket.emit('notification', '[21:21] Notification: Unknown command');
      break;
  }
}

module.exports.processUserInput = function (io, socket, data, currentUser) {
  const words = data.split(' ').filter(function isNotEmpty(currentValue) {
    return (currentValue !== '');
  });

  console.log(words);
  if (words[0][0] == '/') processUserCommand(socket, words, currentUser);
  else broadcastUserMessage(io, data, currentUser);
};
