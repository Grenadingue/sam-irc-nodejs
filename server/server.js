#!/usr/bin/env nodemon

// Include application configuration file
const conf = require('./config/app.config.json');

// Include node libraries
const express = require('express');
const session = require('express-session');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');
const Store = require('express-sequelize-session')(session.Store);

// Configure app middleware
app.use(require('morgan')('combined'));
app.use(cookieParser());
app.use(require('body-parser').urlencoded({ extended: true }));

// Configure view engine to render EJS templates
app.set('views', __dirname + '/www/ejs');
app.set('view engine', 'ejs');

// Initialize node libraries for this project
const orm = require('./modules/sequelize.js')(Sequelize, Store, __dirname);

app.use(session({
  name: 'sid',
  secret: 'trololo cat',
  store: orm.store,
  resave: false,
  saveUninitialized: true,
}));

require('./modules/passport.js')(passport, LocalStrategy, orm);
require('./modules/express.js')(express, app, __dirname, passport, orm);
require('./modules/socket.io.js')(io, orm, passportSocketIo, cookieParser, __dirname);

// Launch http server event loop
server.listen(conf.port, function () {
  console.log('Http server listening on port ' + conf.port);
});
