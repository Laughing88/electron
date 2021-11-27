'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTray;

/**
 * 最小化到托盘  windows系统可用
 */

var _require = require('electron'),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    Tray = _require.Tray,
    Menu = _require.Menu;

var path = require('path');

var tray = void 0;
global.tray = tray;

function createTray() {
  var mainWindow = BrowserWindow.fromId(global.mainId);
  var iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  tray = new Tray(path.join(global.__dirname, iconName));
  var contextMenu = Menu.buildFromTemplate([{
    label: '显示主界面', click: function click() {
      mainWindow.show();
      mainWindow.setSkipTaskbar(false);
    }
  }, {
    label: '退出', click: function click() {
      mainWindow.destroy();
      app.quit();
    }
  }]);
  tray.setToolTip('electron-react');
  tray.setContextMenu(contextMenu);
}
module.exports = exports['default'];