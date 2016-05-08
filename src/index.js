import parser from 'minimist'
import pkginfo from 'pkginfo'
import camelcase from 'camelcase'
import path from 'path'
import { spawn } from 'child_process'

class Args {
  constructor() {
    this.details = {
      options: [],
      commands: []
    }

    this.config = {
      help: true,
      version: true,
      errors: true
    }

    this.option('help', 'Output usage information')
    this.command('help', 'Display help')
  }

  option (name, description, init, defaultValue) {
    let usage = []

    switch (name.constructor) {
      case String:
        usage[0] = name.charAt(0)
        usage[1] = name

        break
      case Array:
        usage = usage.concat(name)
        break
      default:
        throw new Error('Invalid name for option')
    }

    if (usage.length > 0 && usage[0].length > 1) {
      throw new Error('Short version of option is longer than 1 char')
    }

    let optionDetails = {
      defaultValue,
      usage,
      description
    }

    if (defaultValue) {
      let initFunction = typeof init === 'function'
      optionDetails.init = initFunction ? init : this.handleType(defaultValue)[1]
    }

    this.details.options.push(optionDetails)
    return this
  }

  command (usage, description) {
    this.details.commands.push({
      usage,
      description
    })

    return this
  }

  handleType (value) {
    const type = value.constructor

    switch (type) {
      case String:
        return ['[value]', toString]
        break
      case Array:
        return ['<list>']
        break
      case Number:
        return ['<n>', parseInt]
        break
      default:
        return false
    }
  }

  readOption (option) {
    let value = false,
        contents = {}

    for (let name of option.usage) {
      let fromArgs = this.raw[name]

      if (fromArgs) {
        value = fromArgs
      }
    }

    for (let name of option.usage) {
      let propVal = value || option.defaultValue,
          condition = true

      if (option.init) {
        if (option.init === toString) {
          condition = propVal.constructor === Number
        }

        if (condition) {
          propVal = option.init(propVal)
        }
      }

      name = camelcase(name)
      if (propVal) contents[name] = propVal
    }

    return contents
  }

  getOptions () {
    let options = {},
        args = {}

    Object.assign(args, this.raw)
    delete args._

    // Set option defaults
    for (let option of this.details.options) {
      if (!option.defaultValue) continue
      Object.assign(options, this.readOption(option))
    }

    // Override defaults if used in command line
    for (let option in args) {
      let related = this.isDefined(option, 'options')

      if (related) {
        let details = this.readOption(related)
        Object.assign(options, details)
      } else if (this.config.errors) {
        // Throw an error if option not defined
        console.error(`Option "${option}" not known`)
      }
    }

    // Assign options to current instance
    // Will be dropped in 1.0.0
    for (let option in options) {
      this[option] = options[option]
    }

    return options
  }

  generateDetails (kind) {
    const items = this.details[kind]
    let parts = []

    for (let item in items) {
      let usage = items[item].usage,
          initial = items[item].defaultValue

      if (usage.constructor === Array) {
        usage = `-${usage[0]}, --${usage[1]}`
        usage += initial ? ' ' + this.handleType(initial)[0] : ''
      }

      items[item].usage = usage
    }

    const longest = items.sort((a, b) => {
      return b.usage.length - a.usage.length
    })[0].usage.length

    for (let item of items) {
      let usage = item.usage,
          difference = longest - usage.length

      usage += ' '.repeat(difference)
      parts.push('  ' + usage + '  ' + item.description)
    }

    return parts
  }

  runCommand (name) {
    if (this.config.help && name === 'help') {
      this.showHelp()
      return
    }

    const full = this.binary + '-' + name

    let args = process.argv,
        i = 0

    while (i < 3) {
      args.shift()
      i++
    }

    this.child = spawn(full, args, {
      stdio: 'inherit',
      detached: true
    })

    this.child.on('error', err => {
      throw err
    })
  }

  checkVersion () {
    const parent = module.parent

    pkginfo(parent)
    const version = parent.exports.version

    if (version) {
      this.option('version', 'Output the version number', version)

      if (this.raw.v || this.raw.version) {
        console.log(version)
        process.exit()
      }
    }
  }

  isDefined (name, list) {
    const children = this.details[list]

    for (let child of children) {
      let usage = child.usage,
          type = usage.constructor

      if (type === Array && usage.includes(name)) {
        return child
      }

      if (type === String && usage === name) {
        return child
      }
    }

    return false
  }

  parse (argv, options) {
    Object.assign(this.config, options)

    this.raw = parser(argv.slice(1))
    this.binary = path.basename(this.raw._[0])

    if (this.config.version) {
      this.checkVersion()
    }

    const subCommand = this.raw._[1] || false,
          helpTriggered = this.raw.h || this.raw.help

    if (this.isDefined(subCommand, 'commands')) {
      this.runCommand(subCommand)
      return {}
    }

    if (this.config.help && helpTriggered) {
      this.showHelp()
    }

    return this.getOptions()
  }

  showHelp () {
    const binary = path.basename(this.raw._[0]).replace('-', ' ')

    let details = [
      '',
      `Usage: ${binary} [options] [command]`,
      '',
      '',
      'Commands:',
      ''
    ]

    const commands = this.generateDetails('commands'),
          options = this.generateDetails('options')

    details = details.concat(
      commands,
      [
        '',
        'Options:',
        ''
      ],
      options,
      ''
    )

    console.log(details.join('\n  '))
    process.exit()
  }
}

export default new Args
