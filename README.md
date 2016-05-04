# args [![Gitter](https://badges.gitter.im/leo/args.svg)](https://gitter.im/leo/args?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

> This package makes creating command line interfaces a breeze.

While there might be many alternatives out there, all ones I used are still based on old best practises. But since I'm not trying to reinvent the wheel here, I've decided to take advantage of [minimist](https://npmjs.com/minimist) for all of the actual parsing.

**So what makes args special?**

- Git-style sub commands (e.g. "pizza-cheese")
- Auto-generated usage information
- Determines type of option by checking type of default value (e.g. `['hi']` => `<list>`)
- Clean [syntax](#usage) for defining options and commands
- The core only contains a [few hundred lines](src/index.js) of code (even after transpiling)
- Besides of [minimist](https://npmjs.com/minimist) and [pkginfo](https://npmjs.com/pkginfo), no additional dependencies are used
- Easily retrieve values of options: `args.option`

## Usage

Firstly, you need to install the package:

```bash
npm install --save args
```

Once you're done, you can start using it within your binaries:

```js
#!/usr/bin/env node

import args from 'args'

args
  .option('port', 'The port on which the app will be running', 3000)
  .option('reload', 'Enable/disable livereloading')
  .command('serve', 'Serve your static site')

args.parse(process.argv)
```

The upper code defines two options called "port" and "reload" for the current binary, as well as a new sub command named "serve". So if you want to check for the value of the "port" option, just do this:

```js
// This also works with "args.p", because the short name of the "port" option is "p"

if (args.port) {
  console.log(`I'll be running on port ${args.port}`)
}
```

In turn, this is how the auto-generated usage information will look like:

```

  Usage: haha [options] [command]
  
  
  Commands:
  
    serve  Serve your static site
    help   Display help
  
  Options:
  
    -v, --version  Output the version number
    -r, --reload   Enable/disable livereloading
    -h, --help     Output usage information
    -p, --port     The port on which the app will be running
    
```

## API

### .option(name, description, init, default)

Shall be used to register a new option for the binary in which it's being called.

- **name:** Takes a string which defines the name of the option. In this case, the first letter will be used as the short version (`port` => `-p, --port`). However, it can also be an array in which the first value defines the short version (`p` => `-p`) and the second one the long version (`packages` => `--packages`).
- **description:** A short explanation of what the option shall be used for. Will be outputted along with help.
- **init:** A function through which the option's value will be passed when used. The first paramater within said function will contain the option's value. If the parameter "default" is defined, args will provide a default initializer depending on the type of its value. For example: If "default" contains an integer, "init" will be "parseInt".
- **default:** If it's defined, args will not only use it as a default value for the property, but it will also determine the type and append it to the usage info when the help gets outputted. For example: If the default param of an option named "package" contains an array, the usage information will look like this: `-p, --package <list>`.

### .command(name, description)

Register a new sub command. Args requires all binaries to be defined in the style of git's. That means each sub command should be a separate binary called "&#60;parent-command&#62;-&#60;sub-command&#62;".

For example: If your main binary is called "muffin", the binary of the subcommand "muffin list" should be called "muffin-list". And all of them should be defined as such in your [package.json](https://docs.npmjs.com/files/package.json#bin).

- **name:** Takes a string which defines the name of the command. This value will be used when outputting the help.
- **description:** A short explanation of what the command shall be used for. Will be outputted along with help.

### .parse(argv)

This method takes the process' command line arguments (command and options) and uses the internal methods to get their values and assign them to the current instance of args. It needs to be run after all of the `.option` and `.command` calls. If you run it before them, the method calls after it won't take effect.

- **argv:** Should be the process' argv: `process.argv`, for example.

## Contribute

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Link the package to the global module directory: `npm link`
3. Transpile the source code and watch for changes: `gulp`
4. Within the module you want to test your local development instance of args, just link it to the dependencies: `npm link args`. Instead of the default one from npm, node will now use your clone of args!
