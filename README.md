# args

There are many packages out there that are trying to make building command line interfaces a breeze. However, many of them are still based on old best practises and the rest doesn't even provide a real API for easily setting up commands and options. Instead of that, the majority only parses the arguments and does nothing else.

But beware: We're not trying to reinvent the wheel here. Because of that, we've decided to take advantage of [minimist](https://www.npmjs.com/package/minimist) for all of the actual parsing. Thanks to this decision, args' base only contains a [few hundred lines](src/index.js) of code.

## Usage

### API

#### .option(name, description, initializer, default)
