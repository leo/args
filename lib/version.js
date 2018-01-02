'use strict';

const fs = require('fs');
const path = require('path');

function findPackage(directory) {
  const file = path.resolve(directory, 'package.json');
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    return file;
  }
  const parent = path.resolve(directory, '..');
  if (parent === directory) {
    return null;
  }
  return findPackage(parent);
}

module.exports = function() {
  const filename = module.parent && module.parent.filename;
  const dir = filename && path.dirname(filename);
  const file = dir && findPackage(dir);
  const pkg = (file && require(file)) || {};
  const version = pkg.version || '-/-';

  console.log(version);

  if (this.config.exit && this.config.exit.version) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
  }
};
