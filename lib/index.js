'use strict';

const chalk = require('chalk');
const utils = require('./utils');

function Args() {
  this.details = {
    options: [],
    commands: [],
    examples: []
  };

  // Configuration defaults
  this.config = {
    help: true,
    version: true,
    usageFilter: null,
    value: null,
    name: null,
    mainColor: 'yellow',
    subColor: 'dim'
  };

  this.printMainColor = chalk;
  this.printSubColor = chalk;
}

// Assign internal helpers
for (const util in utils) {
  if (!{}.hasOwnProperty.call(utils, util)) {
    continue;
  }
  Args.prototype[util] = utils[util];
}

// Public
Args.prototype.option = require('./option');
Args.prototype.options = require('./options');
Args.prototype.command = require('./command');
Args.prototype.parse = require('./parse');
Args.prototype.example = require('./example');
Args.prototype.examples = require('./examples');
Args.prototype.showHelp = require('./help');

module.exports = new Args();
