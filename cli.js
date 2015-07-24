#!/usr/bin/env node
'use strict';

var replHere = require('./');

var helpVersion = require('help-version')(usage()),
    minimist = require('minimist'),
    textTable = require('text-table'),
    pairs = require('object-pairs'),
    chalk = require('chalk'),
    tableHeader = require('table-header'),
    stringLength = require('string-length'),
    replHistory = require('repl.history'),
    home = require('home-dir'),
    findRoot = require('find-root'),
    cmpby = require('cmpby'),
    mapKeys = require('map-keys'),
    camelCase = require('camel-case');

var Repl = require('repl'),
    Path = require('path');


function usage() {
  return [
    'Usage:  repl-here [OPTION]...',
    '',
    'Options:',
    '  -v, --verbose               Print name table.',
    '  -l, --load-main             Load module at current working directory.',
    '  -i MODULE, --ignore=MODULE  Ignore module by name.'
  ].join('\n');
}


var opts = mapKeys(minimist(process.argv.slice(2), {
  boolean: ['verbose', 'load-main'],
  string: ['ignore'],
  alias: {
    verbose: 'v',
    'load-main': 'l',
    ignore: 'i'
  },
  unknown: function () {
    helpVersion.help(1);
  }
}), camelCase);


var loadHistory = function (repl) {
  var historyFile = home('.node_history');
  replHistory(repl, historyFile);
  return repl;
};


var renderNameTable = function (names) {
  var table = pairs(names).sort(cmpby(function (row) {
    return row[0];
  }));

  if (!table.length) {
    return '';
  }

  table.forEach(function (row) {
    if (!row[1]) {
      row[1] = chalk.red('(failed to load)');
    }
  });

  tableHeader.add(table, ['MODULE', 'VARIABLE'], { stringLength: stringLength });
  table.push(table[1]);
  return textTable(table);
};


(function main(opts) {
  var repl = loadHistory(Repl.start({
    prompts: '> ',
    useGlobal: true
  }));

  var names = {};

  var packageName = function (path) {
    return Path.basename(Path.dirname(path)) == 'node_modules'
      ? Path.basename(path) // node_modules/file.js
      : Path.basename(findRoot(path)); // node_modules/module/src/index.js
  };

  replHere(repl, process.cwd(), opts)
    .on('load', function (name, path) {
      names[packageName(path)] = name;
    })
    .on('fail', function (name, path) {
      if (opts.verbose) {
        names[packageName(path)] = false;
      }
      else {
        console.error('\rModule failed to load: ' + name);
      }
    })
    .on('end', function () {
      if (opts.verbose) {
        var table = renderNameTable(names);
        console.log('\r' + (table || chalk.dim('(No modules found.)')));
      }
      repl.displayPrompt();
    });
}(opts));
