'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var util = require('util');

var exec = util.promisify(require('child_process').exec);

var bs = {
  bin: {
    diff: path.resolve(__dirname, './bsdiff'),
    patch: path.resolve(__dirname, './bspatch')
  },
  diff: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(oldFile, newFile, patchFile) {
      var _ref2, stderr;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return exec(bs.bin.diff + ' ' + oldFile + ' ' + newFile + ' ' + patchFile);

            case 2:
              _ref2 = _context.sent;
              stderr = _ref2.stderr;

              if (!stderr) {
                _context.next = 6;
                break;
              }

              throw new Error(stderr);

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function diff(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }(),
  patch: function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(oldFile, newFile, patchFile) {
      var _ref4, stderr;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return exec(bs.bin.patch + ' ' + oldFile + ' ' + newFile + ' ' + patchFile);

            case 2:
              _ref4 = _context2.sent;
              stderr = _ref4.stderr;

              if (!stderr) {
                _context2.next = 6;
                break;
              }

              throw new Error(stderr);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function patch(_x4, _x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }(),
  do: function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(oldApp, newApp) {
      var oldFile, newFile, patchFile;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              oldFile = path.resolve('./old.zip');
              newFile = path.resolve('./new.zip');
              patchFile = path.resolve('./patchFile');
              _context3.next = 5;
              return bs.diff(oldFile, newFile, patchFile);

            case 5:
              newApp;

            case 6:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function _do(_x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  }()
};

exports.default = bs;
module.exports = exports['default'];