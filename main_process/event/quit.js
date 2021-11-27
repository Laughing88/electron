'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleQuit;

var _electron = require('electron');

var hasQuit = false; /**
                      * 程序退出监控
                      */

function checkQuit(mainWindow, event) {
  var options = {
    type: 'info',
    title: '关闭确认',
    message: '确认要最小化程序到托盘吗？',
    buttons: ['确认', '关闭程序']
  };
  _electron.dialog.showMessageBox(options, function (index) {
    if (index === 0) {
      event.preventDefault();
      mainWindow.hide();
    } else {
      hasQuit = true;
      mainWindow = null;
      _electron.app.exit(0);
    }
  });
}
function handleQuit() {
  var mainWindow = _electron.BrowserWindow.fromId(global.mainId);
  mainWindow.on('close', function (event) {
    event.preventDefault();
    checkQuit(mainWindow, event);
  });
  _electron.app.on('window-all-closed', function () {
    if (!hasQuit) {
      if (process.platform !== 'darwin') {
        hasQuit = true;
        _electron.ipcMain.removeAllListeners();
        _electron.app.quit();
      }
    }
  });
}
module.exports = exports['default'];