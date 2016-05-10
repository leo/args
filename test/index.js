import test from 'ava'
import args from '../dist'
import { version } from '../package.json'

const argv = ['node', 'foo', '-p', '--data']

test('options', t => {
  args
    .option('port', 'The port on which the site will run')
    .option(['d', 'data'], 'The data that shall be used')

  const config = args.parse(argv)

  for (let property in config) {
    let content = config[property]

    switch (content) {
      case version:
        t.is(content, version)
        break
      default:
        t.true(content)
    }
  }
})

test('config', t => {
  const runner = args.parse(argv, {
    help: false,
    errors: false
  })

  t.true(args.config.version)
  t.false(args.config.help)
  t.false(args.config.errors)
})
