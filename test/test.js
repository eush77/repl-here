'use strict';

var replHere = require('..');

var test = require('tape'),
    through = require('through2'),
    assign = require('object.assign');

var Repl = require('repl'),
    path = require('path');


test(function (t) {
  var repl = Repl.start({
    input: through(),
    output: through()
  });

  var oldContext = assign({}, repl.context);

  var loaded = ['module-as-directory', 'module-as-file.json'];
  var loadedName = ['moduleAsDirectory', 'moduleAsFile'];
  var failed = ['empty'];

  replHere(repl, path.join(__dirname, 'fixtures'))
    .on('fail', function (err, module) {
      t.error(err, 'fails on a broken module');
      t.notEqual(failed.indexOf(module), -1, 'fails on ' + module);
    })

    .on('load', function (module, name) {
      var i = loaded.indexOf(module);
      t.notEqual(i, -1, 'loads ' + module);
      t.equal(loadedName[i], name, 'loads ' + module + ' as ' + name);
    })

    .on('end', function () {
      t.test('context', function (t) {
        Object.keys(oldContext).forEach(function (name) {
          t.equal(repl.context[name], oldContext[name],
                  'includes ' + name + ' from the default repl context');
        });

        loadedName.forEach(function (name) {
          t.equal(repl.context[name], name,
                  'includes ' + name + ' from the correct node module');
        });

        t.equal(Object.keys(repl.context).length,
                Object.keys(oldContext).length + loadedName.length,
                'doesn\'t have anything unexpected');
        t.end();
      });
      t.end();
    });
});
