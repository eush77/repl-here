'use strict';

var isModuleName = require('./src/is-module-name');

var camelCase = require('camel-case'),
    resolveFrom = require('resolve-from');

var fs = require('fs'),
    path = require('path');


module.exports = function (repl, dir, errorCallback) {
  errorCallback = errorCallback || Function.prototype;

  fs.readdir(path.join(dir, 'node_modules'), function (err, filenames) {
    filenames
      .filter(isModuleName)
      .forEach(function (module) {
        try {
          repl.context[camelCase(module)] = require(resolveFrom(dir, module));
        }
        catch (e) {
          errorCallback(e, module);
        }
      });
  });
};
