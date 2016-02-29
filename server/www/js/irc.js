const socket = io();
const passport = {
  id: null,
  name: null,
};
var channels = {};
var currentChannel = {};

socket.on('passport', function (data) {
  passport.id = data.id;
  passport.name = data.name;

  $('form').submit(function () {
    socket.emit('user message', { channel: currentChannel.name, message: $('#m').val() });
    $('#m').val('');
    return false;
  });
});

function addMessage(channel, message) {
  channel.messages.push(message);
  if (channel.name == currentChannel.name) {
    $('#messages').append($('<li>').text(message));
    $('#messages li:last')[0].scrollIntoView();
  }
}

socket.on('user message', function (data) {
  const channel = channels[data.channel];

  if (channel) {
    addMessage(channel, data.message);
  } else {
    console.log('socket.on user message : an error occured : message = ' + data.message);
  }
});

socket.on('notification', function (data) {
  const channel = channels[data.channel];

  if (channel) {
    addMessage(channel, data.message);
  } else {
    console.log('socket.on server notification : an error occured : message = ' + data.messag);
  }
});

socket.on('new channel', function (data) {
  if (!channels[data.channel]) {
    channels[data.channel] = {
      name: data.channel,
      messages: [],
    };
  } else {
    console.log('Channel ' + data.channel + ' already exists');
  }
});

socket.on('show channel', function (data) {
  const channel = channels[data.channel];

  if (channel) {
    currentChannel = channel;
    $('#messages').children().remove();

    channel.messages.forEach(function (message) {
      $('#messages').append($('<li>').text(message));
    });

    if ($('#messages li:last') && $('#messages li:last')[0]) {
      $('#messages li:last')[0].scrollIntoView();
    }
  } else {
    console.log('socket.on show channel : channel ' + data.channel + ' not found');
  }
});
