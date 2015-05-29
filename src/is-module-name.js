'use strict';

var validatePackageName = require('validate-npm-package-name');


module.exports = function (name) {
  var is = validatePackageName(name);
  return is.validForOldPackages || is.validForNewPackages;
};
