class Parser {
  constructor() {
    this.argv = process.argv
  }

  option (name, description, defaultValue) {
    let variants = {}

    switch (name.constructor) {
      case String:
        variants.short = name.charAt(0)
        variants.long = name
        break
      case Array:
        variants.short = name[0]
        variants.long = name[1]
        break
      default:
        console.error(`Invalid name for option ${name}`)
    }

    for (let kind in variants) {
      const value = variants[kind]
      this[value] = this.getArgument(value) || defaultValue
    }

    return this
  }

  setInstanceProperty (name, initialValue) {
    this[name] = this.getArgument(name) || defaultValue
  }

  getArgument (name, kind) {
    return false
  }
}

export default new Parser
