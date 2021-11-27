"use strict";

var envList = ["moke", "beta", "development", "production"];

exports.envList = envList;

var urlBeta = 'https://wwww.xxx-beta.com';

var urlDev = 'https://wwww.xxx-dev.com';

var urlProp = 'https://wwww.xxx-prop.com';

var urlMoke = 'https://wwww.xxx-moke.com';

var path = require('path');

var pkg = require(path.resolve(global.__dirname, 'package.json'));

var build = pkg['build-config'];

exports.handleEnv = {
  build: build,
  currentEnv: 'moke',
  setEnv: function setEnv(env) {
    this.currentEnv = env;
  },
  getUrl: function getUrl() {
    console.log('env:', build.env);
    if (build.env === 'production' || this.currentEnv === 'production') {
      return urlProp;
    } else if (this.currentEnv === 'moke') {
      return urlMoke;
    } else if (this.currentEnv === 'development') {
      return urlDev;
    } else if (this.currentEnv === "beta") {
      return urlBeta;
    }
  },
  isDebugger: function isDebugger() {
    return build.env === 'development';
  }
};