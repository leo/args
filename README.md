# args

There are many packages out there that are trying to make building command line interfaces a breeze. However, many of them are still based on old best practises and the rest doesn't even provide a real API for easily setting up commands and options. Instead of that, the majority only parses the arguments and does nothing else.

But beware: We're not trying to reinvent the wheel here. Because of that, we've decided to take advantage of [minimist](https://www.npmjs.com/package/minimist) for all of the actual parsing. Thanks to this decision, args' base only contains a [few hundred lines](src/index.js) of code.

## Usage

### API

#### .option(name, description, init, default)

Shall be used to register a new option for the binary in which it's being called.

- **name:** Takes a string which defines the name of the option. In this case, the first letter will be used as the short version (`port` => `-p, --port`). However, it can also be an array in which the first value defines the short version (`p` => `-p`) and the second one the long version (`packages` => `--packages`).
- **description:** A short explanation of what the option shall be used for. Will be outputted along with help.
- **init:** A function through which the option's value will be passed when used. The first paramater within said function will contain the option's value. If the parameter "default" is defined, args will provide a default initializer depending on the type of its value. For example: If "default" contains an integer, "init" will be "parseInt".
- **default:** If it's defined, args will not only use it as a default value for the property, but it will also determine the type and append it to the usage info when the help gets outputted. For example: If the default param of an option named "package" contains an array, the usage information will look like this: `-p, --package <list>`.

#### .command(name, description)

Register a new command. Args requires all binaries to be defined in the style of git's. That means each sub command should be a separate binary called "&#60;parent-command&#62;-&#60;sub-command&#62;".

For example: If your main binary is called "muffin", the binary of the subcommand "muffin list" should be called "muffin-list". And all of them should be defined as such in your [package.json](https://docs.npmjs.com/files/package.json#bin).

- **name:** Takes a string which defines the name of the command. This value will be used when outputting the help.
- **description:** A short explanation of what the command shall be used for. Will be outputted along with help.

#### .parse(argv)

This method takes the process' command line arguments (command and options) and uses the internal methods to get their values and assign them to the current instance of args. It needs to be run after all of the `.option` and `.command` calls. If you run it before them, the method calls after it won't take effect.

- **argv:** Should be the process' argv: `process.argv`, for example.
