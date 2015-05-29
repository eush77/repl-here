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
      ee.emit('error', err);
      return;
    }

    filenames
      .filter(isModuleName)
      .forEach(function (module) {
        try {
          repl.context[camelCase(module)] = require(resolveFrom(dir, module));
        }
        catch (e) {
          ee.emit('fail', err, module);
        }
      });

    ee.emit('end');
  });

  return ee;
};
