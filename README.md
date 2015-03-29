[![npm](https://nodei.co/npm/repl-here.png)](https://nodei.co/npm/repl-here/)

# repl-here

[![Dependency Status][david-badge]][david]

Node REPL that autoloads all modules in `node_modules/` at startup, just like core libs.

Inspired by [repl-it](http://npm.im/repl-it).

[david]: https://david-dm.org/eush77/repl-here
[david-badge]: https://david-dm.org/eush77/repl-here.png

## CLI

```
Usage:  repl-here
```

## API

### `replHere(repl, basedir)`

Require all modules from `$basedir/node_modules` into the repl (first argument).

## Install

```
npm install -g repl-here
```

## License

MIT
