[![npm](https://nodei.co/npm/repl-here.png)](https://nodei.co/npm/repl-here/)

# repl-here

[![Build Status](https://travis-ci.org/eush77/repl-here.svg?branch=master)](https://travis-ci.org/eush77/repl-here) [![Dependency Status][david-badge]][david]

Node REPL that autoloads all modules in `./node_modules/` at startup, just like core libs.

[david]: https://david-dm.org/eush77/repl-here
[david-badge]: https://david-dm.org/eush77/repl-here.png

## CLI

```
Usage:  repl-here [-v | --verbose]
```

`--verbose` flag prints a table describing how a particular module is named inside the REPL. Variable names are effectively camel-cased versions of module names.

## API

### `ee = replHere(repl, basedir)`

Require all modules from `$basedir/node_modules` into the repl (first argument).

Returns EventEmitter.

### Event: `load`

```
ee.on('fail', function(name, path))
```

Emitted if module `name` is loaded from `path`.

### Event: `fail`

```
ee.on('fail', function(name, path))
```

Emitted whenever module `name` fails to load.

### Event: `end`

```
ee.on('end', function())
```

Emitted if `repl` is done being populated with modules.

### Event: `error`

```
ee.on('error', function(err))
```

Emitted if a fatal error occurred. At this point `repl` may be half-way populated or left intact.

## Related

- [repl-it](http://npm.im/repl-it) works in the context of a project. It walks up the directory tree, parses `package.json` for dependencies and devDependencies, has options like loading main project files, etc.

- [scratchy](http://npm.im/scratchy) is sort of a hybrid of `repl-it` and `repl-here`: it walks up the directory tree as `repl-it` does but requires everything inside `node_modules` just like `repl-here`. This means you can't simply `npm install foo` and load it into the repl immediately afterwards (which is the problem this module is trying to solve).

## Install

```
npm install -g repl-here
```

## License

MIT
