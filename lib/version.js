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

module.exports = function(parent) {
  // The runCommand method passes the definition's usage, which in this case is "version".
  // @todo The "parent" parameter should be removed once BC support is no longer needed.
  parent = !parent || parent === 'version' ? this.parent : parent;

  const filename = parent && parent.filename;
  const dir = filename && path.dirname(filename);
  const file = dir && findPackage(dir);
  const pkg = (file && require(file)) || {};
  const version = pkg.version || '-/-';

  console.log(version);

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
};
