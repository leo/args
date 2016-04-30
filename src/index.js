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

    if (this.args._[1] == 'help' || this.args.h || this.args.help) {
      this.renderHelp()
    }
  }

  option (name, description, defaultValue) {
    let variants = []

    switch (name.constructor) {
      case String:
        variants[0] = name.charAt(0)
        variants[1] = name

        break
      case Array:
        variants.concat(name)
        break
      default:
        console.error(`Invalid name for option ${name}`)
    }

    this.details.options.push({
      usage: `-${variants[0]}, --${variants[1]}`,
      description
    })

    this.setProperties(variants, defaultValue)
    return this
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

  renderHelp () {
    const binary = path.basename(this.args._[0])

    let details = [
      '',
      `Usage: ${binary} [options] [command]`,
      '',
      '',
      'Options:',
      ''
    ]

    const options = this.details.options

    const longest = options.sort((a, b) => {
      return b.usage.length - a.usage.length
    })[0].usage.length

    for (let option of options) {
      let usage = option.usage,
          difference = longest - usage.length

      usage += ' '.repeat(difference)
      details.push(usage + '  ' + option.description)
    }

    details.push('')
    console.log(details.join('\n  '))

    process.exit()
  }
}

export default new Commander
