'use strict';

const path = require('path');
const testName = path.basename(__filename);

const assert = require('assert');

const hro = require('./helpers/HiddenReadOnly');
const extendError = require('./ErrorExtender');

describe(testName, function () {

  it('should obscure type name', function () {
    const NError = extendError('NError');
    assert.strictEqual(NError.prototype.toString(), 'NError');
    assert.strictEqual(NError.prototype.name, 'NError');
    assert.strictEqual(NError.name, 'Created by error-extender: "NError"');
    assert.strictEqual(NError.toString(), '[Created by error-extender: "NError"]');
  });

  it('should return new "error" that is instanceof `Error`', function () {
    const NError = extendError('NError');
    assert.ok(NError() instanceof Error);
    assert.ok(new NError() instanceof Error);
  });

  it('should return defaults', function () {
    const NError = extendError('NError', { defaultMessage: 'default message', defaultData: 'default data' });
    assert.strictEqual(NError.defaultMessage, 'default message');
    assert.strictEqual(NError.defaultData, 'default data');
    assert.strictEqual(new NError().message, 'default message');
    assert.strictEqual(NError().data, 'default data');
  });

  it('should return extended', function () {
    const NError = extendError('NError');
    const SError = extendError('SError', { parent: NError });
    assert.ok(SError() instanceof NError);
    assert.ok(new SError() instanceof Error);
  });

  it('should return with message', function () {
    const NError = extendError('NError', { defaultMessage: 'default message' });
    assert.strictEqual(new NError().message, 'default message');
    assert.strictEqual(NError({ m: 'the message' }).message, 'the message');
  });

  it('should return with data (context)', function () {
    const NError = extendError('NError', {
      defaultData: { status: 400, body: { status: 'fail', data: { username: 'Username cannot be left blank.' } } }
    });
    const SError = extendError('SError', {
      parent: NError,
      defaultData: { status: 404, body: { data: { username: 'Username not found.' } } }
    });
    assert.strictEqual(new NError({ d: 'the data' }).data, 'the data');
    assert.deepStrictEqual(NError({ m: 'the message' }).data,
      { status: 400, body: { status: 'fail', data: { username: 'Username cannot be left blank.' } } });
    assert.deepStrictEqual(SError().data,
      { status: 404, body: { status: 'fail', data: { username: 'Username not found.' } } });
    assert.deepStrictEqual(NError({ d: { status: 404, body: { status: 'error' } } }).data,
      { status: 404, body: { status: 'error', data: { username: 'Username cannot be left blank.' } } });
  });

  it('should return with extended stack (cause)', function () {
    const NError = extendError('NError');
    const SError = extendError('SError', { parent: NError });
    const rootError = new Error('the root error');
    const firstWrapperError = new SError({ c: rootError, m: 'first wrapper' });
    const lastWrapperError = new NError({ c: firstWrapperError, m: 'last wrapper' });
    assert.strictEqual(lastWrapperError.message, 'last wrapper');
    assert.strictEqual(lastWrapperError.cause.message, 'first wrapper');
    assert.strictEqual(lastWrapperError.cause.cause.message, 'the root error');
    {
      const stacktrace = firstWrapperError.stack.split('Caused by: ');
      assert.strictEqual(stacktrace.length, 2);
      assert.strictEqual(stacktrace[0].substring(0, stacktrace[0].indexOf('\n')), 'SError: first wrapper');
      assert.strictEqual(stacktrace[1].substring(0, stacktrace[1].indexOf('\n')), 'Error: the root error');
    }
    {
      const stacktrace = lastWrapperError.stack.split('Caused by: ');
      assert.strictEqual(stacktrace.length, 3);
      assert.strictEqual(stacktrace[0].substring(0, stacktrace[0].indexOf('\n')), 'NError: last wrapper');
      assert.strictEqual(stacktrace[1].substring(0, stacktrace[1].indexOf('\n')), 'SError: first wrapper');
      assert.strictEqual(stacktrace[2].substring(0, stacktrace[2].indexOf('\n')), 'Error: the root error');
    }
  });

  it('should capture stackless causes', function () {
    const NError = extendError('NError');
    const rootError = new Error('the root error');
    hro(rootError, 'stack', undefined);
    const lastWrapperError = new NError({ c: rootError, m: 'last wrapper' });
    const stacktrace = lastWrapperError.stack.split('Caused by: ');
    assert.strictEqual(stacktrace.length, 2);
    assert.strictEqual(stacktrace[0].substring(0, stacktrace[0].indexOf('\n')), 'NError: last wrapper');
    assert.strictEqual(stacktrace[1], 'Error: the root error');
  });

});