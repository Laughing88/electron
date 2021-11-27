'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleMessage;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var html = _url2.default.format({
  protocol: 'file:',
  pathname: _path2.default.join(__dirname, '../static/window.html'),
  slashes: true
});

var draghtml = _url2.default.format({
  protocol: 'file:',
  pathname: _path2.default.join(__dirname, '../static/window_drag.html'),
  slashes: true
});

var transhtml = _url2.default.format({
  protocol: 'file:',
  pathname: _path2.default.join(__dirname, '../static/window_trans.html'),
  slashes: true
});

function windowInit() {
  _electron.ipcMain.on('window-inited', function (event, data) {
    Object.assign(global, data);
  });
}

function windowClose() {
  _electron.ipcMain.on('window-close', function (event, data) {
    var mainWindow = _electron.BrowserWindow.fromId(global.mainId);
    mainWindow.close();
  });
}

function createWindow() {
  _electron.ipcMain.on('create-window', function (event, data) {
    var win = new _electron.BrowserWindow({
      width: 800,
      height: 600
    });
    win.on('close', function () {
      win = null;
    });
    win.loadURL('http://www.conardli.top/');
  });
}

function createNoBarWindow() {
  _electron.ipcMain.on('create-nobar-window', function (event, data) {
    var win = new _electron.BrowserWindow({
      width: 800,
      height: 600,
      frame: false
    });
    win.on('close', function () {
      win = null;
    });
    win.loadURL(html);
  });
}

function createNoBarWindowWithButton() {
  _electron.ipcMain.on('create-nobar-window-button', function (event, data) {
    var win = new _electron.BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      titleBarStyle: 'hidden'
    });
    win.on('close', function () {
      win = null;
    });
    win.loadURL(html);
  });
}

function createWindowDrag() {
  _electron.ipcMain.on('create-nobar-window-drag', function (event, data) {
    var win = new _electron.BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      titleBarStyle: 'hidden'
    });
    win.on('close', function () {
      win = null;
    });
    win.loadURL(draghtml);
  });
}

function createWindowTrans() {
  _electron.ipcMain.on('create-window-trans', function (event, data) {
    var win = new _electron.BrowserWindow({
      width: 800,
      height: 600,
      transparent: true,
      frame: false,
      titleBarStyle: 'hidden'
    });
    win.on('close', function () {
      win = null;
    });
    win.loadURL(transhtml);
  });
}

function getSyncMsg() {
  _electron.ipcMain.on('sync-render', function (event, data) {
    console.log(data);
    event.sender.send('main-msg', '主进程收到了渲染进程的【异步】消息！');
  });
}

function getAsyncMsg() {
  _electron.ipcMain.on('async-render', function (event, data) {
    console.log(data);
    event.returnValue = '主进程收到了渲染进程的【同步】消息！';
  });
}

function sendMsg() {

  var i = 0;
  var mainWindow = _electron.BrowserWindow.fromId(global.mainId);
  _electron.ipcMain.on('start-msg', function (event, data) {
    console.log('开始定时向渲染进程发送消息！');
    global.sendMsg = true;
  });

  _electron.ipcMain.on('end-msg', function (event, data) {
    console.log('结束向渲染进程发送消息！');
    global.sendMsg = false;
  });

  setInterval(function () {
    if (global.sendMsg) {
      mainWindow.webContents.send('main-msg', 'ConardLi\u3010' + i++ + '\u3011');
    }
  }, 200);
}

function handleMessage() {
  windowInit();
  windowClose();
  createWindow();
  createNoBarWindow();
  createNoBarWindowWithButton();
  createWindowDrag();
  createWindowTrans();
  getSyncMsg();
  getAsyncMsg();
  sendMsg();
}
module.exports = exports['default'];