// Packages
import test from 'ava'

// Ours
import args from '../dist'
import {version} from '../package.json'

const argv = [
  'node',
  'foo',
  '-p',
  '--data'
]

test('options', t => {
  args
    .option('port', 'The port on which the site will run')
    .option(['d', 'data'], 'The data that shall be used')

  const config = args.parse(argv)

  for (const property in config) {
    if (!{}.hasOwnProperty.call(config, property)) {
      continue
    }

    const content = config[property]

    switch (content) {
      case version:
        t.is(content, version)
        break
      default:
        t.true(content)
    }
  }
})

test('usage information', t => {
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
  args.parse(argv, {
    help: false,
    errors: false
  })

  t.true(args.config.version)
  t.false(args.config.help)
  t.false(args.config.errors)
})
