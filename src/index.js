import parser from 'minimist'
import pkginfo from 'pkginfo'
import path from 'path'

class Commander {
  constructor() {
    this.args = parser(process.argv.slice(1))
    const parent = module.parent

    pkginfo(parent)
    const version = parent.exports.version

    this.details = {
      options: [],
      commands: []
    }

    if (version) {
      this.option('version', 'Output the version number', version)

      if (this.args.v || this.args.version) {
        console.log(version)
        process.exit()
      }
    }

    this.option('help', 'Output usage information')
    this.command('help', 'Display help')

    if (this.args._[1] == 'help' || this.args.h || this.args.help) {
      this.renderHelp()
    }

    const args = this.args
    args._.shift()

    this.raw = args
  }

  option (name, description, defaultValue) {
    let variants = []

    switch (name.constructor) {
      case String:
        variants[0] = name.charAt(0)
        variants[1] = name

        break
      case Array:
        variants = variants.concat(name)
        break
      default:
        throw new Error('Invalid name for option')
    }

    if (variants.length > 0 && variants[0].length > 1) {
      throw new Error('Short version of option is longer than 1 char')
    }

    this.details.options.push({
      usage: `-${variants[0]}, --${variants[1]}`,
      description
    })

    this.setProperties(variants, defaultValue)
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

  generateDetails (items) {
    let parts = []

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

    const options = this.details.options
    const commands = this.details.commands

    details = details.concat(this.generateDetails(commands))

    details = details.concat([
      '',
      'Options:',
      ''
    ])

    details = details.concat(this.generateDetails(options))

    details.push('')
    console.log(details.join('\n  '))

    process.exit()
  }
}

export default new Commander
