'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = require('url');
var path = require('path');
var request = require('request');

var _require = require('electron'),
    dialog = _require.dialog,
    app = _require.app,
    ipcMain = _require.ipcMain,
    BrowserWindow = _require.BrowserWindow;

var installMac = require('./install/mac.js');
var installWin = require('./install/win.js');

var pkg = require(path.resolve(global.__dirname, 'package.json'));
var build = pkg['build-config'];

var getDateStr = function getDateStr() {
  var now = new Date();
  return '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate();
};

var updateMac = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(filePath) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(process.platform === 'darwin')) {
              _context.next = 3;
              break;
            }

            _context.next = 3;
            return installMac(filePath);

          case 3:
            if (!(process.platform === 'win32')) {
              _context.next = 6;
              break;
            }

            _context.next = 6;
            return installWin(filePath);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function updateMac(_x) {
    return _ref.apply(this, arguments);
  };
}();

var Updater = {
  CHECKING: false,
  DIS_CHECK_DATE: null,
  init: function init() {
    Updater.checkUpdate(true);
    Updater.timer = setInterval(function () {
      Updater.checkUpdate(true);
    }, 5 * 60 * 1000);
  },


  handleError: function handleError(err, exit) {
    dialog.showErrorBox('更新失败', err.message || String(err));
    exit && app.exit(0);
  },

  checkUpdate: function checkUpdate(silent) {
    var _this = this;

    var auto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (Updater.CHECKING) return Promise.resolve();
    var build = pkg['build-config'];
    build.gid = global.device.gid;
    var host = build.env === 'production' ? 'https://xxx-prod.com/' : 'http://xxx-beta.com/';
    var checkUrl = url.resolve(host, '/app/update/versionCheck?appid=' + build.appid + '&vid=' + build.version + '&gid=' + build.gid);
    return new Promise(function (resolve, reject) {
      request(checkUrl, function (err, response, body) {
        Updater.CHECKING = false;
        if (err) return reject(new Error('网络异常，请稍后再试'));
        try {
          var res = JSON.parse(body);
          return resolve(res);
        } catch (error) {
          return reject(new Error('服务端异常，获取更新信息失败'));
        }
      });
    }).then(function (_ref2) {
      var status = _ref2.status,
          data = _ref2.data,
          msg = _ref2.msg;

      if (status !== 0) throw new Error(status + ' ' + msg);
      return data;
    }).then(function (data) {
      _this.showUpdateDialog(data, silent);
    }).catch(function (e) {
      if (!auto) dialog.showErrorBox('检查更新失败', e.message);
    });
  },
  showUpdateDialog: function showUpdateDialog(data, silent) {
    if (data) {
      if (!data.forceUpdate && silent && Updater.DIS_CHECK_DATE && Updater.DIS_CHECK_DATE === getDateStr()) return;
      Updater.showUpdateWindow(data);
    } else {
      Updater.CHECKING = false;
      if (!silent) {
        dialog.showMessageBox({
          type: 'info',
          buttons: ['确认'],
          message: '没有可更新版本',
          detail: '您当前已经是最新版本，无需更新'
        });
      }
    }
  },
  showUpdateWindow: function showUpdateWindow(data) {
    var md5 = data.checksum;


    var updateUrl = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'download.html'),
      slashes: true,
      query: data
    });
    if (Updater.win) {
      Updater.win.webContents.send('autoUpdater-update', data);
      if (data.forceUpdate) {
        BrowserWindow.getAllWindows().forEach(function (w) {
          var updateWinId = Updater.win && Updater.win.id;
          if (w.id !== updateWinId) w.destroy();
        });
      }
      return;
    }
    var win = new BrowserWindow({
      width: 270,
      height: 360,
      resizable: false,
      transparent: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      alwaysOnTop: true,
      frame: false,
      show: false,
      title: '自动更新',
      webPreferences: {
        webSecurity: build.env === 'production'
      }
    });
    Updater.win = win;
    if (data.forceUpdate) {
      BrowserWindow.getAllWindows().forEach(function (w) {
        var updateWinId = Updater.win && Updater.win.id;
        if (w.id !== updateWinId) w.destroy();
      });
    }

    var downloaded = false;
    var cancel = function cancel() {
      Updater.CHECKING = false;
      Updater.win = null;
      // Updater.handleError(new Error('更新被取消'), data.forceUpdate);
    };

    win.on('ready-to-show', function () {
      win.show();
    });

    win.loadURL(updateUrl);
    win.on('close', function (e) {
      if (downloaded) e.preventDefault();
    });
    win.on('closed', function () {
      cancel();
      if (data.forceUpdate) {
        app.quit();
      }
    });
    ipcMain.removeAllListeners('autoUpdater-ignore');
    ipcMain.removeAllListeners('autoUpdater-downloaded');
    ipcMain.on('autoUpdater-ignore', function () {
      Updater.DIS_CHECK_DATE = getDateStr();
      win.close();
    });

    ipcMain.on('autoUpdater-downloaded', function (event, err, filePath, hash) {
      downloaded = true;
      win.removeListener('closed', cancel);
      if (err) return Updater.handleError(err);
      if (md5 !== hash) {
        return Updater.handleError(new Error('下载文件已损坏，请重新尝试'));
      }
      return updateMac(filePath).catch(Updater.handleError);
    });
  }
};

exports.default = Updater;
module.exports = exports['default'];