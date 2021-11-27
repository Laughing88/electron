'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var mainWindow = _electron.BrowserWindow.fromId(global.mainId);
  mainWindow.webContents.on('crashed', function () {
    var errorMessage = _electron.crashReporter.getLastCrashReport();
    console.error('程序崩溃了！', errorMessage);
    reloadWindow(mainWindow);
  });
};

var _electron = require('electron');

// 开启进程崩溃记录
_electron.crashReporter.start({
  productName: 'electron-react',
  companyName: 'ConardLi',
  submitURL: 'http://xxx.com', // 上传崩溃日志的接口
  uploadToServer: false
}); /**
     * 崩溃日志，崩溃重启
     */

function reloadWindow(mainWin) {
  if (mainWin.isDestroyed()) {
    app.relaunch();
    app.exit(0);
  } else {
    // 销毁其他窗口
    _electron.BrowserWindow.getAllWindows().forEach(function (w) {
      if (w.id !== mainWin.id) w.destroy();
    });
    var options = {
      type: 'info',
      title: '渲染器进程崩溃',
      message: '这个进程已经崩溃.',
      buttons: ['重载', '关闭']
    };
    _electron.dialog.showMessageBox(options, function (index) {
      if (index === 0) mainWin.reload();else mainWin.close();
    });
  }
}

module.exports = exports['default'];