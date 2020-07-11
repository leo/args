// Native
import path from 'path'

// Packages
import test from 'ava'
import execa from 'execa'

// Ours
import args from '../lib'
import { version } from '../package'

// Provide a reset function during testing.
args.reset = function() {
  this.details = {
    options: [],
    commands: [],
    examples: []
  }
  return this
}

// Provide a helper function for suppressing any output.
args.suppressOutput = function(fn) {
  const original = process.stdout.write
  process.stdout.write = () => () => {}
  const result = fn.call(this)
  process.stdout.write = original
  return result
}

const port = 8000

const argv = [
  'node',
  'foo',
  '-p',
  port.toString(),
  '--data',
  '--D',
  'D',
  '-a',
  'anotheroptionvalue',
  '-l',
  10
]

// Reset args after each test.
test.afterEach.always(() => {
  args.reset()
})

// @todo Each of these options should be broken out into separate tests.
function setupOptions() {
  args
    .option('port', 'The port on which the site will run')
    .option('true', 'Boolean', true)
    .option('list', 'List', [])
    .option(['d', 'data'], 'The data that shall be used')
    .option('duplicated', 'Duplicated first char in option')
    .options([{ name: 'anotheroption', description: 'another option' }])
  return args
}

// @todo Each of these options should be broken out into separate tests.
test('options', t => {
  const args = setupOptions()

  const config = args.parse(argv)

  for (const property in config) {
    if (!{}.hasOwnProperty.call(config, property)) {
      continue
    }

    const content = config[property]

    switch (content) {
      case 'D':
        t.is(content, 'D')
        break
      case version:
        t.is(content, version)
        break
      case 8000:
        t.is(content, port)
        break
      case 'anotheroptionvalue':
        if (property === 'a') {
          t.is(property, 'a')
        } else {
          t.is(property, 'anotheroption')
        }

        break
      default:
        if (content.constructor === Array) {
          t.deepEqual(content, [10])
        } else {
          t.true(content)
        }
    }
  }
})

test('help/host: only host is triggered', t => {
  args.option('host', 'The host address')
  const config = args.parse(['node', 'foo', '-h', 'http://example.com'])
  t.is(config.h, 'http://example.com')
  t.is(config.host, 'http://example.com')
  t.falsy(config.H)
  t.falsy(config.help)
})

test('help/host: only help is triggered', t => {
  args.option('host', 'The host address')
  const config = args.suppressOutput(() =>
    args.parse(['node', 'foo', '-H'], { exit: { help: false } })
  )
  t.falsy(config.h)
  t.falsy(config.host)
  t.true(config.H)
  t.true(config.help)
})

test('version/verbose: only verbose is triggered', t => {
  args.option('verbose', 'Verbose output')
  const config = args.parse(['node', 'foo', '-v'])
  t.true(config.v)
  t.true(config.verbose)
  t.falsy(config.H)
  t.falsy(config.help)
})

test('version/verbose: only version is triggered', t => {
  args.option('verbose', 'Verbose output')
  const config = args.suppressOutput(() =>
    args.parse(['node', 'foo', '-V'], { exit: { version: false } })
  )
  t.falsy(config.v)
  t.falsy(config.verbose)
  t.true(config.V)
  t.true(config.version)
})

test('usage information', t => {
  const args = setupOptions()
  const filter = data => data

  args.parse(argv, {
    value: '<directories>',
    usageFilter: filter
  })

  const runner = args.config.usageFilter
  const value = 'a test'

  t.is(runner(value), value)
})

test('config', t => {
  const args = setupOptions()
  args.parse(argv, {
    help: false,
    errors: false
  })

  t.true(args.config.version)
  t.false(args.config.help)
  t.false(args.config.errors)
})

function run(command) {
  return execa.stdout('node', [path.join(__dirname, '_fixture'), command])
}

test('command aliases', async t => {
  let result = await run('install')
  t.is(result, 'install')

  result = await run('i')
  t.is(result, 'install')

  result = await run('rm')
  t.is(result, 'uninstall')

  result = await run('cmd')
  t.is(result, '^~^')

  try {
    await run('b')
  } catch (error) {
    t.regex(error.message, /_fixture-binary/gm)
  }

  result = await run('help')
  const regexes = [/binary, b/, /cmd/, /-a, --abc \[value]/]
  for (const regex of regexes) {
    t.regex(result, regex)
  }
})

test('options propogated to mri', t => {
  const args = setupOptions()
  args.option('port', 'The port on which the site will run')

  const config = args.parse(argv, { mri: { string: 'p' } })

  t.is(config.port, port.toString())
})

test('short form option works with mri default', t => {
  const args = setupOptions()
  args.option('port', 'The port on which the site will run')

  const config = args.parse(argv, { mri: { default: { port: 3000 } } })

  t.is(config.port, port)
})
