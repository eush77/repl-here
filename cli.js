#!/usr/bin/env node
'use strict';

var replHere = require('./');

var helpVersion = require('help-version')(usage()),
    minimist = require('minimist');

var Repl = require('repl');


function usage() {
  return 'Usage:  repl-here [-v | --verbose]';
}


var opts = minimist(process.argv.slice(2), {
  boolean: 'verbose',
  alias: { v: 'verbose' },
  unknown: function () {
    helpVersion.help(1);
  }
});


var printNameTable = function (nameTable) {
  Object.keys(nameTable).forEach(function (module) {
    console.log('%s -> %s', module, nameTable[module]);
  });
};


(function main() {
  var repl = Repl.start('> ');
  var nameTable = {};
  replHere(repl, process.cwd())
    .on('load', function (module, name) {
      nameTable[module] = name;
    })
    .on('fail', function (err, module) {
      console.error('\rModule failed to load: ' + module);
    })
    .on('end', function () {
      if (opts.verbose) {
        printNameTable(nameTable);
      }
      repl.displayPrompt();
    });
}());
