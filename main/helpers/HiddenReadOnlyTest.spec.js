'use strict';

const assert = require('assert');

describe(require('path').basename(__filename), function () {

  const hro = require('./HiddenReadOnly');
  const hroConfig = require('./HiddenReadOnlyConfig');

  it('should effectively hide and set to read-only target property', function () {
    let object = {};
    hro(object, 'greeting', 'Hello World!');
    assert.strictEqual(object.greeting, 'Hello World!');
    assert.strictEqual(JSON.parse(JSON.stringify(object)).greeting, undefined);
    assert.throws(() => object.greeting = 'A whole new world!');
  });

  it('should return fresh instance of property descriptor', function () {
    let object = () => ({ greeting: 'Hello World!' });
    let a = object();
    let b = object();
    b.greeting = 'A whole new world!';
    assert.strictEqual('Hello World!', object().greeting);
    assert.strictEqual('Hello World!', a.greeting);
    assert.strictEqual('A whole new world!', b.greeting);
    // --
    let hroConfigA = hroConfig();
    let hroConfigB = hroConfig('value');
    hroConfigB.enumerable = true;
    assert.strictEqual(hroConfig().value, undefined);
    assert.strictEqual(hroConfig().enumerable, false);
    assert.strictEqual(hroConfigA.value, undefined);
    assert.strictEqual(hroConfigA.enumerable, false);
    assert.strictEqual(hroConfigB.value, 'value');
    assert.strictEqual(hroConfigB.enumerable, true);
  });

});