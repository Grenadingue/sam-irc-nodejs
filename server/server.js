#!/usr/bin/env nodemon

// Include application configuration file
const conf = require('./config/app.config.json');

// Include node libraries
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Configure app middleware
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'trololo cat', resave: false, saveUninitialized: false }));

// Configure view engine to render EJS templates
app.set('views', __dirname + '/www/ejs');
app.set('view engine', 'ejs');

// Initialize node libraries for this project
const orm = require('./modules/sequelize.js')(__dirname);
require('./modules/passport.js')(passport, LocalStrategy, orm);
require('./modules/express.js')(express, app, __dirname, passport, orm);
require('./modules/socket.io.js')(io, orm, __dirname);

// Launch http server event loop
server.listen(conf.port, function () {
  console.log('Http server listening on port ' + conf.port);
});
