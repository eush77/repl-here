'use strict';

var camelCase = require('camel-case'),
    resolveFrom = require('resolve-from');

var fs = require('fs'),
    path = require('path');


module.exports = function (repl, dir) {
  fs.readdir(path.join(dir, 'node_modules'), function (err, modules) {
    modules.forEach(function (module) {
      try {
        repl.context[camelCase(module)] = require(resolveFrom(dir, module));
      }
      catch (e) {
        console.log('Module failed to load: ' + module);
      }
    });
  });
};
