const socket = io();
const passport = {
  id: null,
  name: null,
};

socket.on('passport', function (data) {
  passport.id = data.id;
  passport.name = data.name;

  $('form').submit(function () {
    socket.emit('user_input', $('#m').val());
    $('#m').val('');
    return false;
  });
});

function addMessage(data) {
  $('#messages').append($('<li>').text(data));
  $('#messages li:last')[0].scrollIntoView();
}

socket.on('user_input', function (data) {
  addMessage(data);
});

socket.on('notification', function (data) {
  addMessage(data);
});
