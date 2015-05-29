#!/usr/bin/env node
'use strict';

var replHere = require('./');

var Repl = require('repl');


var usage = function (code) {
  console.log('Usage:  repl-here');
  process.exit(code || 0);
};


var main = function () {
  var repl = Repl.start('> ');
  replHere(repl, process.cwd(), function (err, module) {
    console.error('Module failed to load: ' + module);
  });
};


(process.argv.slice(2) == '--help') ? usage() : main();
