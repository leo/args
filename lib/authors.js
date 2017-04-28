'use strict';

const chalk = require('chalk');
const pkginfo = require('pkginfo');

module.exports = function() {
  const parent = module.parent;

  // Load parent module
  pkginfo(parent);

  // Get author(s) from parent module
  const { authors, author } = parent.exports;

  const sublist = (title, list) =>
    Array.isArray(list)
      ? [
          chalk.underline(title),
          ...list.map(
            a => `${this.printSubColor('-')} ${this.printMainColor(a)}`
          )
        ]
      : [`${title}: ${this.printMainColor(list)}`];

  const getOutput = () => {
    if (authors) {
      return sublist('Authors', authors);
    }
    if (author) {
      return sublist('Author', author);
    }
    return ['No author found.'];
  };

  console.log(['', ...getOutput(), ''].join('\n  '));
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
};
