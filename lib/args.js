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

// Internal helpers
Args.prototype.handleType = utils.handleType;
Args.prototype.readOption = utils.readOption;
Args.prototype.getOptions = utils.getOptions;
Args.prototype.generateDetails = utils.generateDetails;
Args.prototype.generateExamples = utils.generateExamples;
Args.prototype.runCommand = utils.runCommand;
Args.prototype.checkVersion = utils.checkVersion;
Args.prototype.isDefined = utils.isDefined;

// Public
Args.prototype.option = require('./option');
Args.prototype.options = require('./options');
Args.prototype.command = require('./command');
Args.prototype.parse = require('./parse');
Args.prototype.example = require('./example');
Args.prototype.examples = require('./examples');
Args.prototype.showHelp = require('./help');

module.exports = Args;
