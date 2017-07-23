// Native
import path from 'path';

// Packages
import test from 'ava';
import execa from 'execa';

// Ours
import args from '../lib';
import { version } from '../package';

const port = 8000;

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
];

test('options', t => {
  args
    .option('port', 'The port on which the site will run')
    .option('true', 'Boolean', true)
    .option('list', 'List', [])
    .option(['d', 'data'], 'The data that shall be used')
    .option('duplicated', 'Duplicated first char in option')
    .options([{ name: 'anotheroption', description: 'another option' }]);

  const config = args.parse(argv);

  for (const property in config) {
    if (!{}.hasOwnProperty.call(config, property)) {
      continue;
    }

    const content = config[property];

    switch (content) {
      case 'D':
        t.is(content, 'D');
        break;
      case version:
        t.is(content, version);
        break;
      case 8000:
        t.is(content, port);
        break;
      case 'anotheroptionvalue':
        if (property === 'a') {
          t.is(property, 'a');
        } else {
          t.is(property, 'anotheroption');
        }
        break;
      default:
        if (content.constructor === Array) {
          t.deepEqual(content, [10]);
        } else {
          t.true(content);
        }
    }
  }
});

test('usage information', t => {
  const filter = data => data;

  args.parse(argv, {
    value: '<directories>',
    usageFilter: filter
  });

  const runner = args.config.usageFilter;
  const value = 'a test';

  t.is(runner(value), value);
});

test('config', t => {
  args.parse(argv, {
    help: false,
    errors: false
  });

  t.true(args.config.version);
  t.false(args.config.help);
  t.false(args.config.errors);
});

function run(command) {
  return execa.stdout('node', [path.join(__dirname, '_fixture'), command]);
}

test('command aliases', async t => {
  let result = await run('install');
  t.is(result, 'install');

  result = await run('i');
  t.is(result, 'install');

  result = await run('rm');
  t.is(result, 'uninstall');

  result = await run('cmd');
  t.is(result, '^~^');

  try {
    await run('b');
  } catch (err) {
    t.regex(err.message, /_fixture-binary/gm);
  }

  result = await run('help');
  const regexes = [/binary, b/, /cmd/, /-a, --abc \[value]/];
  for (const regex of regexes) {
    t.regex(result, regex);
  }
});

test('options propogated to nanomist', t => {
  args.option('port', 'The port on which the site will run');

  const config = args.parse(argv, { nanomist: { string: 'p' } });

  t.is(config.port, port.toString());
});
