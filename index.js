'use strict';

var isModuleName = require('./src/is-module-name');

var camelCase = require('camel-case'),
    resolveFrom = require('resolve-from');

var fs = require('fs'),
    path = require('path'),
    EventEmitter = require('events');


module.exports = function (repl, dir) {
  var ee = new EventEmitter;

  fs.readdir(path.join(dir, 'node_modules'), function (err, filenames) {
    if (err) {
      if (err.code == 'ENOENT') {
        return ee.emit('end');
      }
      return ee.emit('error', err);
    }

    filenames
      .filter(isModuleName)
      .forEach(function (module) {
        try {
          var name = camelCase(module);
          repl.context[name] = require(resolveFrom(dir, module));
          ee.emit('load', module, name);
        }
        catch (e) {
          ee.emit('fail', err, module);
        }
      });

    ee.emit('end');
  });

  return ee;
};
