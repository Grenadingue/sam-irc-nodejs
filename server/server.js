#!/usr/bin/env nodemon

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Sequelize = require('sequelize');

var sequelize = new Sequelize('sam_irc', 'archy', 'bar', {
  host: 'localhost',
  dialect: 'mariadb',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

console.log('Hello world ! Server');

app.use(express.static(__dirname + '/www/html/'));
app.use(express.static(__dirname + '/www/css/'));
app.use(express.static(__dirname + '/www/js/'));

app.get('/jquery/jquery.js', function (req, res) {
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});

app.post('/signup', function (req, res) {
  console.log('signup');
  res.redirect('http://localhost:8080/signin.html');
});

app.post('/signin', function (req, res) {
  console.log('signin');
  res.redirect('http://localhost:8080/index.html'); // redirect to irc
});

io.on('connection', function (socket) {
  console.log('user connected');
  socket.emit('notification', 'client-connected');
  console.log('connected notification sent');

  socket.on('disconnect', function (data) {
    socket.emit('notification', 'client disconnected');
    console.log('user disconnected');
  });

  socket.on('chat message', function (data) {
    socket.emit('chat message', 'User: ' + data);
    console.log('user sent message = ' + data);
  });
});

server.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
