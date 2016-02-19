#!/usr/bin/env electron

// Include application configuration file
const conf = require('./config/app.config.json');

// Include and initialize electron
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', function () {
  app.quit();
});

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: conf.debug ? 1200 : 800,
    height: 600,
    center: true,
  });

  if (conf.debug) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadURL('http://' + conf.remote.host + ':' + conf.remote.port + '/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});
