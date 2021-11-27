'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs-extra');
var path = require('path');

var _require = require('electron'),
    app = _require.app;

var _require2 = require('child_process'),
    execSync = _require2.execSync,
    spawn = _require2.spawn;

var dmgAttacher = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(pathname) {
    var attachPath, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            attachPath = null;
            res = void 0;
            _context.prev = 2;

            res = execSync('hdiutil attach \'' + pathname + '\'').toString('utf8') || '';
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](2);
            throw new Error('DMG Attacher: \u88C5\u8F7D\u5931\u8D25[' + pathname + ']');

          case 9:
            res.split('\t').forEach(function (v) {
              v = v.trim();
              if (v.startsWith('/Volumes/')) {
                attachPath = v;
              }
            });

            if (attachPath) {
              _context.next = 12;
              break;
            }

            throw new Error('DMG Attacher: 未找到装载的app');

          case 12:
            return _context.abrupt('return', {
              appPath: path.join(attachPath, fs.readdirSync(attachPath).find(function (v) {
                return v.endsWith('.app');
              })),
              attachPath: attachPath,
              close: function close() {
                return execSync('hdiutil detach \'' + attachPath + '\'');
              }
            });

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 6]]);
  }));

  return function dmgAttacher(_x) {
    return _ref.apply(this, arguments);
  };
}();

var log = console.log; // eslint-disable-line

exports.default = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dmgPath) {
    var output, _ref3, appPath, attachPath, subprocess;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            output = void 0;

            if (process.env.NODE_ENV !== 'development') {
              output = path.resolve(app.getPath('exe'), '../../../');
            } else {
              output = path.resolve('/Applications/electron-react.app');
            }
            log('退出 electron-react-ScreenShot');
            try {
              execSync('killall electron-react-ScreenShot');
            } catch (error) {
              log('退出 electron-react-ScreenShot 失败，可能app未启动');
            }
            _context2.next = 6;
            return dmgAttacher(dmgPath);

          case 6:
            _ref3 = _context2.sent;
            appPath = _ref3.appPath;
            attachPath = _ref3.attachPath;


            log('开始安装');
            log(path.resolve(__dirname, 'mac_setup.js'));

            subprocess = spawn('sh', [path.resolve(__dirname, 'mac_setup.sh'), attachPath, appPath, output], {
              detached: true,
              stdio: 'ignore'
            });

            subprocess.unref();

            log('退出当前进程');
            app.exit(0);

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = exports['default'];