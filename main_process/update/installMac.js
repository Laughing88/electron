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

var _require = require('child_process'),
    execSync = _require.execSync,
    spawn = _require.spawn;

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

exports.default = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dmgPath, output) {
    var _ref3, attachPath, close, res, appPath;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return dmgAttacher(dmgPath);

          case 2:
            _ref3 = _context2.sent;
            attachPath = _ref3.attachPath;
            close = _ref3.close;
            res = fs.readdirSync(attachPath);
            appPath = path.resolve(attachPath, res.find(function (v) {
              return v.endsWith('.app');
            }));

            execSync('rm -Rf \'' + output + '\' && cp -Rf \'' + appPath + '\' \'' + output + '\'');
            _context2.next = 10;
            return close();

          case 10:
            spawn('open', [output], {
              detached: true
            });

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = exports['default'];