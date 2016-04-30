import parser from 'minimist'
import pkginfo from 'pkginfo'

class Commander {
  constructor() {
    this.args = parser(process.argv.slice(2))
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
}

export default new Commander
