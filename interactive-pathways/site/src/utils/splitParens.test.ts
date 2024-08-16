/// <reference types="jest" />
/* eslint-disable */
/** `require` needs to be overridden with esm. This allows `import` to work in
 * `require`d files. `jest` uses a custom `require` function that currently
 * breaks es6 modules. @see https://github.com/facebook/jest/issues/4842 */
//require = require("esm")(module, { mode: 'all', cjs: true });

import splitParens from './splitParens';

test('split "hello (world)" to equal ["hello", "world"]', () => {
  const received = splitParens('hello (world)');
  expect(received.length).toBe(2);
  expect(received[0]).toBe('hello');
  expect(received[1]).toBe('world');
});
