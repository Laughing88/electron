'use strict';

/**
 * 菜单
 */
var electron = require('electron');
var url = require('url');
var path = require('path');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var app = electron.app;
var UpdateHelper = require('./../update');
var pkg = require(path.resolve(global.__dirname, 'package.json'));
var build = pkg['build-config'];

var template = [{
  label: '工具',
  submenu: [{
    label: '开发者工具',
    accelerator: function () {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I';
      } else {
        return 'Ctrl+Shift+I';
      }
    }(),
    click: function click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  }, {
    label: '环境选择',
    click: function click(item, focusedWindow) {
      var p = url.format({
        protocol: 'file:',
        pathname: path.join(__dirname, '..', 'env/environment.html'),
        slashes: true,
        query: { debugger: build.env === "development", edit: true }
      });
      focusedWindow.loadURL(p);
    }
  }]
}, {
  label: '查看',
  submenu: [{
    label: '重载',
    accelerator: 'CmdOrCtrl+R',
    click: function click(item, focusedWindow) {
      if (focusedWindow) {
        // 重载之后, 刷新并关闭所有的次要窗体
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(function (win) {
            if (win.id > 1) {
              win.close();
            }
          });
        }
        focusedWindow.reload();
      }
    }
  }, {
    label: '切换全屏',
    accelerator: function () {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F';
      } else {
        return 'F11';
      }
    }(),
    click: function click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }
  }, {
    type: 'separator'
  }, {
    label: '应用程序菜单演示',
    click: function click(item, focusedWindow) {
      if (focusedWindow) {
        var options = {
          type: 'info',
          title: '应用程序菜单演示',
          buttons: ['好的'],
          message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
        };
        electron.dialog.showMessageBox(focusedWindow, options, function () {});
      }
    }
  }]
}, {
  label: '窗口',
  role: 'window',
  submenu: [{
    label: '最小化',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: '关闭',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, {
    type: 'separator'
  }, {
    label: '重新打开窗口',
    accelerator: 'CmdOrCtrl+Shift+T',
    enabled: false,
    key: 'reopenMenuItem',
    click: function click() {
      app.emit('activate');
    }
  }]
}];

function addUpdateMenuItems(items, position) {
  if (process.mas) return;

  var version = electron.app.getVersion();
  var updateItems = [{
    label: 'Version ' + version,
    enabled: false
  }, {
    label: '检查更新',
    click: function click() {
      UpdateHelper.checkUpdate(null, false);
    }
  }];

  items.splice.apply(items, [position, 0].concat(updateItems));
}

function findReopenMenuItem() {
  var menu = Menu.getApplicationMenu();
  if (!menu) return;

  var reopenMenuItem = void 0;
  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item;
        }
      });
    }
  });
  return reopenMenuItem;
}

if (process.platform === 'darwin') {
  var name = electron.app.getName();
  template.unshift({
    label: name,
    submenu: [{
      label: '\u5173\u4E8E ' + name,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: '服务',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: '\u9690\u85CF ' + name,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: '隐藏其它',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: '显示全部',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: '退出',
      accelerator: 'Command+Q',
      click: function click() {
        app.quit();
      }
    }]
  });

  // 窗口菜单.
  template[3].submenu.push({
    type: 'separator'
  }, {
    label: '前置所有',
    role: 'front'
  });

  addUpdateMenuItems(template[0].submenu, 1);
}

if (process.platform === 'win32') {
  var helpMenu = template[template.length - 1].submenu;
  addUpdateMenuItems(helpMenu, 0);
}

app.on('ready', function () {
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on('browser-window-created', function () {
  var reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = false;
});

app.on('window-all-closed', function () {
  var reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = true;
});