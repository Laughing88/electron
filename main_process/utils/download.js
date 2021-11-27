'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var uniqFilename = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(fname) {
    var pathname, i;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pathname = '';
            i = 0;

          case 2:
            console.log(3);
            pathname = concatFilename(fname, i);
            _context.next = 6;
            return fsExists(pathname);

          case 6:
            if (_context.sent) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('break', 11);

          case 8:
            i++;
            _context.next = 2;
            break;

          case 11:
            return _context.abrupt('return', pathname);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function uniqFilename(_x) {
    return _ref.apply(this, arguments);
  };
}();

var writeFile = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(info) {
    var uri, fname, progressCB, pathname, downloaded, stream, req, aborted, ret;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            uri = info.url, fname = info.name, progressCB = info.progress;
            _context2.next = 3;
            return uniqFilename(fname);

          case 3:
            pathname = _context2.sent;
            downloaded = 0;
            _context2.next = 7;
            return createStream(pathname);

          case 7:
            stream = _context2.sent;
            req = request.get(uri);

            console.log(5, req);
            aborted = false;
            ret = new Promise(function (resolve, reject) {

              req.on('error', function (err) {
                return reject(err);
              });

              req.on('response', function (res) {
                if (res.statusCode !== 200) {
                  var err = new Error('statusCode' + res.statusCode);
                  err.response = res;
                  return reject(err);
                }

                if (res.headers["content-length"] == null) {
                  return reject(new Error('没有说明文件大小'));
                }

                var size = parseInt(res.headers["content-length"], 10);

                res.on('data', function (trunk) {
                  if (!stream) return; //do nothing, just waiting
                  stream.write(trunk);
                  downloaded += trunk.length;
                  progressCB && progressCB(size, downloaded);
                });

                res.on('end', function () {
                  if (stream) {
                    stream.end();
                    stream = null;
                  }

                  return resolve({
                    name: pathname
                  });
                });

                stream.once('error', function (err) {
                  req.abort();
                  return reject(new Error('磁盘故障'));
                });
              });
            }).catch(function (err) {
              if (stream) {
                stream.end();
                stream = null;
              }
              throw err;
            });
            return _context2.abrupt('return', {
              promise: ret,
              abort: function abort() {
                aborted = true;
                req.abort.call(req);
              }
            });

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function writeFile(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

///////////////////////utils///////////////////


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs-extra');
var url = require('url');
var path = require('path');
var request = require('request');
var http = require('http');

var _cacheDIR = '/tmp/';

function isAbsolutePath(path_) {
  return path_ && path_[0] === '/';
}

function concatFilename(fname, i) {
  console.log(5, fname, i);
  var dir = isAbsolutePath(fname) ? '' : _cacheDIR;
  if (i === 0) {
    return path.join(dir, fname);
  }
  var sp = fname.split('.');
  if (sp.length === 0) {
    throw new Error('no fname');
  } else if (sp.length === 1) {
    return path.join(dir, '' + fname + i);
  } else {
    sp[sp.length - 2] += '(' + i + ')';
    return path.join(dir, sp.join('.'));
  }
}

function fsExists(pathname) {
  return new Promise(function (resolve, reject) {
    fs.exists(pathname, function (exists) {
      exists ? resolve(true) : resolve(false);
    });
  });
}

function _request(uri) {
  var addr_ = url.parse(uri);
  var opt_ = {
    method: 'GET',
    hostname: addr_.hostname,
    port: addr_.port || 80,
    path: addr_.path,
    headers: {
      'Host': addr_.host
    },
    timeout: 30000
  };

  return new Promise(function (resolve, reject) {
    var req = http.request(opt_, function (res) {
      return resolve(res);
    });
    req.once('error', function (err) {
      return reject(err);
    });
    req.end();
  });
}

function fsUnlink(pathname) {
  return new Promise(function (resolve, reject) {
    fs.unlink(pathname, function (err) {
      if (err) reject(err);
      resolve();
    });
  });
}

function createStream(pathname) {
  fs.ensureDirSync(path.dirname(pathname));
  return new Promise(function (resolve, reject) {
    fs.open(pathname, "w", function (e, fd) {
      if (e) {
        reject(e);
        return;
      }
      var stream = fs.createWriteStream(pathname, {
        flags: "w",
        fd: fd,
        encoding: null,
        mode: '0666'
      });
      resolve(stream);
      return;
    });
  });
}

function sleep(n) {
  return new Promise(function (A) {
    return setTimeout(A, n * 1000);
  });
}

module.exports = writeFile;