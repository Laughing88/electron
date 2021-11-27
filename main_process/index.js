'use strict';

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

var _mainUrl = require('./mainUrl');

var _mainUrl2 = _interopRequireDefault(_mainUrl);

var _deviceid = require('./utils/deviceid.js');

var _deviceid2 = _interopRequireDefault(_deviceid);

var _quit = require('./event/quit');

var _quit2 = _interopRequireDefault(_quit);

var _message = require('./event/message');

var _message2 = _interopRequireDefault(_message);

var _crashed = require('./protect/crashed');

var _crashed2 = _interopRequireDefault(_crashed);

var _tray = require('./protect/tray');

var _tray2 = _interopRequireDefault(_tray);

var _autoStart = require('./protect/autoStart');

var _autoStart2 = _interopRequireDefault(_autoStart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./menu');

var _require = require('electron'),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow;

var mainWindow = void 0;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    transparent: true,
    titleBarStyle: 'hidden',
    frame: false
  });
  mainWindow.loadURL((0, _mainUrl2.default)());
  if (process.platform === 'win32') {
    mainWindow.on('close', function (event) {
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
      event.preventDefault();
    });
  }
  global.mainId = mainWindow.id;
}

if (process.platform === 'win32') {
  var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  if (shouldQuit) {
    app.quit();
  };
}

var devicePromise = _deviceid2.default.get();
app.on('ready', function () {
  devicePromise.then(function () {
    return _update2.default.init();
  }).then(function () {
    return createWindow();
  }).then(function () {
    return (0, _message2.default)();
  }).then(function () {
    return (0, _crashed2.default)();
  }).then(function () {
    return (0, _quit2.default)();
  }).then(function () {
    return (0, _tray2.default)();
  }).then(function () {
    if (process.platform === 'win32') {
      (0, _autoStart2.default)();
    }
  });
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});