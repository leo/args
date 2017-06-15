'use strict';

const chalk = require('chalk');
const pkginfo = require('pkginfo');

module.exports = function() {
  const parent = module.parent;

  // Load parent module
  pkginfo(parent);

  // Get author(s) from parent module
  const authors = parent.exports.authors;
  const author = parent.exports.author;

  const sublist = (title, list) =>
    Array.isArray(list)
      ? [chalk.underline(title)].concat(
          list.map(a => `${this.printSubColor('-')} ${this.printMainColor(a)}`)
        )
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

  const output = getOutput();
  output.unshift('');
  output.push('');
  console.log(output);
  console.log(output.join('\n  '));
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
};