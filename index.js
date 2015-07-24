'use strict';

var acquire = require('acquire'),
    mapKeys = require('map-keys'),
    camelCase = require('camel-case');

var fs = require('fs'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter;


module.exports = function (repl, dir, opts) {
  opts = opts || {};
  var ee = new EventEmitter;

  process.nextTick(function () {
    var modules = acquire.resolve({ basedir: dir,
                                    ignore: opts.ignore,
                                    skipFailures: ee.emit.bind(ee, 'fail') });

    if (opts.loadMain) {
      modules[path.basename(dir)] = require.resolve(dir);
    }

    modules = mapKeys(modules, camelCase);

    Object.keys(modules).forEach(function (name) {
      try {
        repl.context[name] = require(modules[name]);
        ee.emit('load', name, modules[name]);
      }
      catch (e) {
        ee.emit('fail', name, modules[name]);
      }
    });

    ee.emit('end');
  });

  return ee;
};
