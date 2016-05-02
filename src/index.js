import parser from 'minimist'
import pkginfo from 'pkginfo'
import path from 'path'
import { spawn } from 'child_process'

class Commander {
  constructor() {
    this.details = {
      options: [],
      commands: []
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

  setProperties (option) {
    let value = false

    for (let name of option.usage) {
      let fromArgs = this.args[name]

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

      if (propVal) this[name] = propVal
    }
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

  renderHelp () {
    const binary = path.basename(this.args._[0])

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

    /*
    if (this.child) {
      this.child.kill('SIGINT')
    }*/

    process.exit()
  }

  runCommand (name) {
    const full = path.basename(this.args._[0]) + '-' + name

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

  parse (argv) {
    this.args = parser(argv.slice(1))
    const subCommand = this.args._[1] || false

    for (let command of this.details.commands) {
      if (command.usage !== subCommand) {
        continue
      }

      this.runCommand(subCommand)
      return
    }

    const parent = module.parent

    pkginfo(parent)
    const version = parent.exports.version

    if (version) {
      this.option('version', 'Output the version number', version)

      if (this.args.v || this.args.version) {
        console.log(version)
        process.exit()
      }
    }

    if (this.args._[1] == 'help' || this.args.h || this.args.help) {
      this.renderHelp()
    }

    for (let option of this.details.options) {
      this.setProperties(option)
    }

    const args = this.args
    args._.shift()

    this.raw = args
  }
}

export default new Commander
