import parser from 'minimist'
import pkginfo from 'pkginfo'
import path from 'path'

class Commander {
  constructor() {
    this.details = {
      options: [],
      commands: []
    }

    this.option('help', 'Output usage information')
    this.command('help', 'Display help')
  }

  option (name, description, defaultValue) {
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

    this.details.options.push({
      initial: defaultValue || false,
      usage,
      description
    })

    return this
  }

  command (usage, description) {
    this.details.commands.push({
      usage,
      description
    })
  }

  setProperties (names, initial) {
    let value = false

    for (let name of names) {
      let fromArgs = this.args[name]

      if (fromArgs) {
        value = fromArgs
      }
    }

    for (let name of names) {
      this[name] = value
    }
  }

  generateDetails (kind) {
    const items = this.details[kind]
    let parts = []

    for (let item in items) {
      let usage = items[item].usage

      if (usage.constructor === Array) {
        usage = `-${usage[0]}, --${usage[1]}`
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

    const commands = this.generateDetails('commands')
    const options = this.generateDetails('options')

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

  parse (argv) {
    this.args = parser(argv.slice(1))

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
      this.setProperties(option.usage, option.initial)
    }

    const args = this.args
    args._.shift()

    this.raw = args
  }
}

export default new Commander
