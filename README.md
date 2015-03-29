[![npm](https://nodei.co/npm/repl-here.png)](https://nodei.co/npm/repl-here/)

# repl-here

[![Dependency Status][david-badge]][david]

Node REPL that autoloads all modules in `node_modules/` at startup, just like core libs.

[david]: https://david-dm.org/eush77/repl-here
[david-badge]: https://david-dm.org/eush77/repl-here.png

## CLI

```
Usage:  repl-here
```

## API

### `replHere(repl, basedir)`

Require all modules from `$basedir/node_modules` into the repl (first argument).

## Why not X?

- [repl-it](http://npm.im/repl-it): works in the context of a project, hence walks up the directory tree, parses `package.json` for dependencies and devDependencies, has options like loading main project files, etc.

- [scratchy](http://npm.im/scratchy): does not work quite as advertised because it also walks up the directory tree and so you can't `npm install foo` and load it into the repl immediately afterwards (which is kind of a problem this module is trying to solve).


## Install

```
npm install -g repl-here
```

## License

MIT
