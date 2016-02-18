#!/usr/bin/env nodemon

// Include application configuration file
const conf = require('./config/app.config.json');

// Include node libraries
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Initialize node libraries for this project
var sequelize = require('./modules/sequelize.js')(__dirname);
require('./modules/socket.io.js')(io);
require('./modules/express.js')(express, app, __dirname);

// Launch http server event loop
server.listen(conf.port, function () {
  console.log('Server listening on port ' + conf.port + '!');
});
