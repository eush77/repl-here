'use strict';

var replHere = require('..');

var test = require('tape'),
    through = require('through2'),
    assign = require('object.assign');

var Repl = require('repl'),
    Path = require('path');


var fixtures = Path.join(__dirname, 'fixtures');
var root = Path.resolve(__dirname, '..');


test(function (t) {
  var repl = Repl.start({
    input: through(),
    output: through()
  });

  var oldContext = assign({}, repl.context);

  var loaded = ['module-as-directory', 'module-as-file.json'];
  var loadedName = ['moduleAsDirectory', 'moduleAsFile'];
  var failed = ['empty'];

  replHere(repl, fixtures)
    .on('fail', function (name, path) {
      t.notEqual(failed.indexOf(name), -1, 'fails on ' + name);
    })

    .on('load', function (name, path) {
      var dirname = Path.relative(fixtures, path).split(Path.sep, 2)[1];
      var i = loaded.indexOf(dirname);
      path = Path.relative(root, path);
      t.notEqual(i, -1, 'loads ' + path);
      t.equal(loadedName[i], name, 'loads ' + path + ' as ' + name);
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


test('load-main', function (t) {
  var repl = Repl.start({
    input: through(),
    output: through()
  });

  t.plan(3);

  replHere(repl, fixtures, { loadMain: true })
    .on('load', function (name, path) {
      if (name == 'fixtures') {
        t.pass('loads main module at the working dir');
        t.equal(Path.relative(root, path), 'test/fixtures/index.json', 'path');
        t.equal(repl.context.fixtures, true, 'content');
      }
    });
});
