const args = require('../dist')

args.command('install', 'desc here', () => {
  console.log('install')
}, ['i'])

args.command('uninstall', 'another desc here', () => {
  console.log('uninstall')
}, ['u', 'rm', 'remove'])

args.command('cmd', 'cmd desc', () => {
  console.log('^~^')
})

args.command('binary', 'some desc', ['b'])

args.option(['a', 'abc'], 'something', 'def value')

args.parse(process.argv)
