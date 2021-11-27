'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getmac = require('getmac');
var fs = require('fs');
var path = require('path');

var _require = require('electron'),
    app = _require.app;

global.device = {};

var setDevice = function setDevice(uuid, mac) {
  global.device.uuid = uuid;
  global.device.mac = mac || uuid.split('---')[0];
  if (process.platform === 'darwin') {
    global.device.gid = (global.device.mac || '').replace(/:/g, '');
  } else {
    global.device.gid = global.device.mac || '';
  }
  console.log('gid:', global.device.gid);
};

var macAddress = null;

function getMac() {
  if (macAddress) return Promise.resolve(macAddress);
  return new Promise(function (resolve, reject) {
    getmac.getMac(function (err, mac) {
      if (err) return reject(err);
      macAddress = mac.toLowerCase();
      return resolve(macAddress);
    });
  });
}

var deviceFile = path.resolve(app.getPath('appData'), 'ELECTRON_REACT_DEVICE_UUID');
var uuid = void 0;
try {
  uuid = fs.readFileSync(deviceFile).toString('utf8');
} catch (error) {
  uuid = null;
}

// TODO: 从本地 storage 拉取 deviceId
exports.get = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var rand;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rand = void 0;

        case 1:
          if (!1) {
            _context.next = 7;
            break;
          }

          rand = '' + Math.random();

          if (!(rand.length > 4)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt('break', 7);

        case 5:
          _context.next = 1;
          break;

        case 7:
          return _context.abrupt('return', getMac().then(function (mac) {
            return mac + '---' + rand.slice(2);
          }).catch(function () {
            return '' + rand.slice(2);
          }).then(function (uuid_) {
            if (!uuid) {
              uuid = uuid_;
            }
            fs.writeFile(deviceFile, uuid);
            setDevice(uuid, macAddress);
            return uuid;
          }));

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));

exports.getMac = getMac;