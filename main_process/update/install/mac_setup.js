'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs-extra');

var _require = require('electron'),
    app = _require.app;

var path = require('path');

var _require2 = require('child_process'),
    execSync = _require2.execSync;

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

var _process$argv = (0, _slicedToArray3.default)(process.argv, 4),
    dmgPath = _process$argv[2],
    output = _process$argv[3];

var logs = [];

var log = function log() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return logs.push(args.join(' '));
};

(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
  var _ref3, appPath, closeDmg;

  return _regenerator2.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          app.dock.hide();
          _context2.next = 3;
          return dmgAttacher(dmgPath);

        case 3:
          _ref3 = _context2.sent;
          appPath = _ref3.appPath;
          closeDmg = _ref3.close;

          try {
            log('rm -Rf \'' + output + '\' && cp -Rf \'' + appPath + '\' \'' + output + '\'');
            execSync('rm -Rf \'' + output + '\' && cp -Rf \'' + appPath + '\' \'' + output + '\'');
          } catch (error) {
            log(error);
          }
          closeDmg();
          execSync('open ' + output);
          app.relaunch({
            execPath: output
          });

        case 10:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
}))().then(app.exit(0));