'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if (build.env === 'production') {
    return url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, '..', 'render_process', 'index.html'),
      slashes: true
    });
  }
  return url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, 'env/environment.html'),
    slashes: true,
    query: { debugger: build.env === "development" }
  });
};

var url = require('url');
var path = require('path');
var pkg = require(path.resolve(global.__dirname, 'package.json'));
var build = pkg['build-config'];

module.exports = exports['default'];