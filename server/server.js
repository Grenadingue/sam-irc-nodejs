#!/usr/bin/env nodemon

// Include node libraries
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Sequelize = require('sequelize');

// Initialize node libraries for this project
var sequelize = require('./modules/sequelize.js')(Sequelize);
require('./modules/socket.io.js')(io);
require('./modules/express.js')(express, app, __dirname);

// Launch http server event loop
server.listen(8080, function () {
  console.log('Server listening on port 8080!');
});
