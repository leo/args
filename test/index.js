import test from 'ava'
import args from '../dist'

const argv = ['node', 'foo', '-p', '--data']

test('options', t => {
  args
    .option('port', 'The port on which the site will run')
    .option(['d', 'data'], 'The data that shall be used')

  const properties = args.parse(argv)

  for (let property in properties) {
    let content = properties[property]

    switch (content) {
      case '1.0.0':
        t.is(content, '1.0.0')
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
