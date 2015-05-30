#!/usr/bin/env node
'use strict';

var replHere = require('./');

var helpVersion = require('help-version')(usage()),
    minimist = require('minimist'),
    textTable = require('text-table'),
    pairs = require('object-pairs'),
    chalk = require('chalk'),
    tableHeader = require('table-header'),
    stringLength = require('string-length');

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


var printNameTable = function (names) {
  var table = pairs(names);

  table.forEach(function (row) {
    if (!row[1]) {
      row[1] = chalk.red('(failed to load)');
    }
  });

  tableHeader.add(table, ['MODULE', 'VARIABLE'], { stringLength: stringLength });
  table.push(table[1]);
  console.log('\r' + textTable(table));
};


(function main() {
  var repl = Repl.start('> ');
  var names = {};
  replHere(repl, process.cwd())
    .on('load', function (module, name) {
      names[module] = name;
    })
    .on('fail', function (err, module) {
      if (opts.verbose) {
        names[module] = false;
      }
      else {
        console.error('\rModule failed to load: ' + module);
      }
    })
    .on('end', function () {
      if (opts.verbose) {
        printNameTable(names);
      }
      repl.displayPrompt();
    });
}());
