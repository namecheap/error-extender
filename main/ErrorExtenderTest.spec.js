'use strict';

const assert = require('assert');

const extendError = require('./ErrorExtender');

describe(require('path').basename(__filename), function () {

  it('should return new "error" that is instanceof `Error`', function () {
    const NewErrorType = extendError('NewErrorType');
    assert.ok(NewErrorType() instanceof Error);
    assert.ok(new NewErrorType() instanceof Error);
  });

  it('should successfully "extend" other errors created by error-extender', function () {
    const NewErrorType = extendError('NewErrorType');
    const AnotherNewErrorType = extendError('AnotherNewErrorType', NewErrorType);
    assert.ok(new AnotherNewErrorType() instanceof Error);
    assert.ok(new AnotherNewErrorType() instanceof NewErrorType);
  });

  it('should obscure prototype details', function () {
    const NewErrorType = extendError('NewErrorType');
    assert.strictEqual(NewErrorType.toString(), '[Created by error-extender: "NewErrorType"]');
    assert.strictEqual(NewErrorType.prototype.toString(), 'NewErrorType');
    assert.strictEqual(NewErrorType.prototype.constructor.toString(), '[Created by error-extender: "NewErrorType"]');
  });

  it('should be able to return `cause` (sub-error)', function () {
    const NewErrorType = extendError('NewErrorType');
    const theRootCause = new NewErrorType('the root cause');
    const newErrorType = new NewErrorType('the new error',
      new NewErrorType('the new sub-error',
        theRootCause));
    assert.strictEqual(newErrorType.message, 'the new error');
    assert.strictEqual(newErrorType.cause.message, 'the new sub-error');
    assert.strictEqual(newErrorType.cause.cause.message, 'the root cause');
  });

  it('should append cause stack to own stack', function () {
    const NewErrorType = extendError('NewErrorType');
    const theRootCause = new Error('the root cause');
    const newErrorType = new NewErrorType('the new error', theRootCause);
    assert.ok(newErrorType.stack.startsWith('NewErrorType: the new error'));
    assert.ok(newErrorType.stack.endsWith(`\nCaused by: ${theRootCause.stack}`));
    const anotherError = new NewErrorType('another error', newErrorType);
    assert.ok(newErrorType.stack.startsWith('NewErrorType: the new error'));
    assert.ok(anotherError.stack.endsWith(`\nCaused by: ${newErrorType.stack}`));
  });

  it('should return handle "stackless"', function () {
    const NewErrorType = extendError('NewErrorType');
    const theRootCause = new NewErrorType('the root cause');
    Object.defineProperty(theRootCause, 'stack', { value: undefined });
    const anError = new NewErrorType('the new error', theRootCause);
    assert.ok(anError.stack.endsWith('\nCaused by: NewErrorType: the root cause'));
  });

  it('should return `context`', function () {

    const NewErrorType = extendError('NewErrorType');

    let theRootCause = new NewErrorType('the root cause', { referenceId: '1234:4321' }, new Error('lerler'));
    assert.strictEqual(theRootCause.message, 'the root cause');
    assert.deepStrictEqual(theRootCause.context, { referenceId: '1234:4321' });
    assert.strictEqual(theRootCause.cause.message, 'lerler');

    theRootCause = new NewErrorType('the root cause', { referenceId: '1234:4321' });
    assert.strictEqual(theRootCause.message, 'the root cause');
    assert.deepStrictEqual(theRootCause.context, { referenceId: '1234:4321' });
    assert.strictEqual(theRootCause.cause, undefined);

    theRootCause = new NewErrorType('the root cause', 'hello', 'world', new Error('lerler'));
    assert.strictEqual(theRootCause.message, 'the root cause');
    assert.deepStrictEqual(theRootCause.context, ['hello', 'world']);
    assert.strictEqual(theRootCause.cause.message, 'lerler');

    theRootCause = new NewErrorType('the root cause', 'hello', 'world');
    assert.strictEqual(theRootCause.message, 'the root cause');
    assert.deepStrictEqual(theRootCause.context, ['hello', 'world']);
    assert.strictEqual(theRootCause.cause, undefined);

    theRootCause = new NewErrorType('the root cause');
    assert.strictEqual(theRootCause.message, 'the root cause');
    assert.deepStrictEqual(theRootCause.context, undefined);
    assert.strictEqual(theRootCause.cause, undefined);

    theRootCause = new NewErrorType(new Error('lerler'));
    assert.strictEqual(theRootCause.message, undefined);
    assert.deepStrictEqual(theRootCause.context, undefined);
    assert.strictEqual(theRootCause.cause.message, 'lerler');

    theRootCause = new NewErrorType();
    assert.strictEqual(theRootCause.message, undefined);
    assert.deepStrictEqual(theRootCause.context, undefined);
    assert.strictEqual(theRootCause.cause, undefined);

  });

});