#!/usr/bin/env nodemon

var express = require('express');
var app = express();

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

app.post('/signup', function (req, res) {
  console.log('signup');

  // res.send('Sign-up POST request');
  res.redirect('http://localhost:8080/signin.html');
});

app.post('/signin', function (req, res) {
  console.log('signin');

  // res.send('Sign-in POST request');
  res.redirect('http://localhost:8080/index.html'); // redirect to irc
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
