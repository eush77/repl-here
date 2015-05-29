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
  replHere(repl, process.cwd())
    .on('fail', function (err, module) {
      console.error('\rModule failed to load: ' + module);
    })
    .on('end', repl.displayPrompt.bind(repl));
};


(process.argv.slice(2) == '--help') ? usage() : main();
