const socket = io();
var username = '<undefined_user>';

$('form').submit(function () {
  socket.emit('user_input', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('identification', function (data) {
  socket.emit('identification', { userid: userid });
});

socket.on('passport', function (data) {
  if (data.userid == userid) {
    username = data.username;
  } else {
    console.log('An error occured, wrong user id');
  }
});

socket.on('user_input', function (data) {
  $('#messages').append($('<li>').text(data));
});

socket.on('notification', function (data) {
  $('#messages').append($('<li>').text(data));
});
