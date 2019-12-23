'use strict';

const assert = require('assert');

describe(require('path').basename(__filename), function () {

  const Assert = require('./Assert');
  const validator = require('./Assert').validator;
  const IllegalArgumentError = require('./Assert').IllegalArgumentError;

  it('should return name of error', function () {
    assert.strictEqual(IllegalArgumentError.toString(), '[IllegalArgumentError]');
    assert.strictEqual(IllegalArgumentError.prototype.toString(), 'IllegalArgumentError');
  });

  it('should validate if truthy', function () {
    assert.ok(validator.isTruthy({}));
    assert.ok(validator.isTruthy(new Object({})));
    assert.ok(validator.isTruthy([]));
    assert.ok(validator.isTruthy(new Object([])));
    assert.ok(validator.isTruthy(new Date()));
    assert.ok(validator.isTruthy(new Error()));
    assert.ok(!validator.isTruthy(null));
    assert.ok(!validator.isTruthy(undefined));
    assert.ok(!validator.isTruthy(0));
    assert.ok(validator.isTruthy(1));
    assert.ok(validator.isTruthy(1.1));
    assert.ok(!validator.isTruthy(''));
    assert.ok(validator.isTruthy('string'));
    //
    assert.ok(Assert.isTruthy({}, undefined, false));
    assert.ok(Assert.isTruthy(new Object({}), undefined, false));
    assert.ok(Assert.isTruthy([], undefined, false));
    assert.ok(Assert.isTruthy(new Object([]), undefined, false));
    assert.ok(Assert.isTruthy(new Date(), undefined, false));
    assert.ok(Assert.isTruthy(new Error(), undefined, false));
    assert.ok(!Assert.isTruthy(null, undefined, false));
    assert.ok(!Assert.isTruthy(undefined, undefined, false));
    assert.ok(!Assert.isTruthy(0, undefined, false));
    assert.ok(Assert.isTruthy(1, undefined, false));
    assert.ok(Assert.isTruthy(1.1, undefined, false));
    assert.ok(!Assert.isTruthy('', undefined, false));
    assert.ok(Assert.isTruthy('string', undefined, false));
    //
    assert.doesNotThrow(() => Assert.isTruthy({}));
    assert.doesNotThrow(() => Assert.isTruthy(new Object({})));
    assert.doesNotThrow(() => Assert.isTruthy([]));
    assert.doesNotThrow(() => Assert.isTruthy(new Object([])));
    assert.doesNotThrow(() => Assert.isTruthy(new Date()));
    assert.doesNotThrow(() => Assert.isTruthy(new Error()));
    assert.throws(() => Assert.isTruthy(null), IllegalArgumentError);
    assert.throws(() => Assert.isTruthy(undefined), IllegalArgumentError);
    assert.throws(() => Assert.isTruthy(0), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isTruthy(1));
    assert.doesNotThrow(() => Assert.isTruthy(1.1));
    assert.throws(() => Assert.isTruthy(''), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isTruthy('string'));
  });

  it('should validate if falsy', function () {
    assert.ok(!validator.isFalsy({}));
    assert.ok(!validator.isFalsy(new Object({})));
    assert.ok(!validator.isFalsy([]));
    assert.ok(!validator.isFalsy(new Object([])));
    assert.ok(!validator.isFalsy(new Date()));
    assert.ok(!validator.isFalsy(new Error()));
    assert.ok(validator.isFalsy(null));
    assert.ok(validator.isFalsy(undefined));
    assert.ok(validator.isFalsy(0));
    assert.ok(!validator.isFalsy(1));
    assert.ok(!validator.isFalsy(1.1));
    assert.ok(validator.isFalsy(''));
    assert.ok(!validator.isFalsy('string'));
    //
    assert.ok(!Assert.isFalsy({}, undefined, false));
    assert.ok(!Assert.isFalsy(new Object({}), undefined, false));
    assert.ok(!Assert.isFalsy([], undefined, false));
    assert.ok(!Assert.isFalsy(new Object([]), undefined, false));
    assert.ok(!Assert.isFalsy(new Date(), undefined, false));
    assert.ok(!Assert.isFalsy(new Error(), undefined, false));
    assert.ok(Assert.isFalsy(null, undefined, false));
    assert.ok(Assert.isFalsy(undefined, undefined, false));
    assert.ok(Assert.isFalsy(0, undefined, false));
    assert.ok(!Assert.isFalsy(1, undefined, false));
    assert.ok(!Assert.isFalsy(1.1, undefined, false));
    assert.ok(Assert.isFalsy('', undefined, false));
    assert.ok(!Assert.isFalsy('string', undefined, false));
    //
    assert.throws(() => Assert.isFalsy({}), IllegalArgumentError);
    assert.throws(() => Assert.isFalsy(new Object({})), IllegalArgumentError);
    assert.throws(() => Assert.isFalsy([]), IllegalArgumentError);
    assert.throws(() => Assert.isFalsy(new Object([])), IllegalArgumentError);
    assert.throws(() => Assert.isFalsy(new Date()), IllegalArgumentError);
    assert.throws(() => Assert.isFalsy(new Error()), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isFalsy(null));
    assert.doesNotThrow(() => Assert.isFalsy(undefined));
    assert.doesNotThrow(() => Assert.isFalsy(0));
    assert.throws(() => Assert.isFalsy(1), IllegalArgumentError);
    assert.throws(() => Assert.isFalsy(1.1), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isFalsy(''));
    assert.throws(() => Assert.isFalsy('string'), IllegalArgumentError);
  });

  it('should validate if object literal', function () {
    assert.ok(validator.isObject({}));
    assert.ok(validator.isObject(new Object({})));
    assert.ok(!validator.isObject([]));
    assert.ok(!validator.isObject(new Object([])));
    assert.ok(!validator.isObject(new Date()));
    assert.ok(!validator.isObject(new Error()));
    assert.ok(!validator.isObject(null));
    assert.ok(!validator.isObject(undefined));
    assert.ok(!validator.isObject(1));
    assert.ok(!validator.isObject(1.1));
    assert.ok(!validator.isObject(''));
    assert.ok(!validator.isObject('string'));
    //
    assert.ok(Assert.isObject({}, undefined, false));
    assert.ok(Assert.isObject(new Object({}), undefined, false));
    assert.ok(!Assert.isObject([], undefined, false));
    assert.ok(!Assert.isObject(new Object([]), undefined, false));
    assert.ok(!Assert.isObject(new Date(), undefined, false));
    assert.ok(!Assert.isObject(new Error(), undefined, false));
    assert.ok(!Assert.isObject(null, undefined, false));
    assert.ok(!Assert.isObject(undefined, undefined, false));
    assert.ok(!Assert.isObject(1, undefined, false));
    assert.ok(!Assert.isObject(1.1, undefined, false));
    assert.ok(!Assert.isObject('', undefined, false));
    assert.ok(!Assert.isObject('string', undefined, false));
    //
    assert.doesNotThrow(() => Assert.isObject({}));
    assert.doesNotThrow(() => Assert.isObject(new Object({})));
    assert.throws(() => Assert.isObject([]), IllegalArgumentError);
    assert.throws(() => Assert.isObject(new Object([])), IllegalArgumentError);
    assert.throws(() => Assert.isObject(new Date()), IllegalArgumentError);
    assert.throws(() => Assert.isObject(new Error()), IllegalArgumentError);
    assert.throws(() => Assert.isObject(null), IllegalArgumentError);
    assert.throws(() => Assert.isObject(undefined), IllegalArgumentError);
    assert.throws(() => Assert.isObject(1), IllegalArgumentError);
    assert.throws(() => Assert.isObject(1.1), IllegalArgumentError);
    assert.throws(() => Assert.isObject(''), IllegalArgumentError);
    assert.throws(() => Assert.isObject('string'), IllegalArgumentError);
  });

  it('should validate if array', function () {
    assert.ok(!validator.isArray({}));
    assert.ok(!validator.isArray(new Object({})));
    assert.ok(validator.isArray([]));
    assert.ok(validator.isArray(new Object([])));
    assert.ok(!validator.isArray(new Date()));
    assert.ok(!validator.isArray(new Error()));
    assert.ok(!validator.isArray(null));
    assert.ok(!validator.isArray(undefined));
    assert.ok(!validator.isArray(1));
    assert.ok(!validator.isArray(1.1));
    assert.ok(!validator.isArray(''));
    assert.ok(!validator.isArray('string'));
    //
    assert.ok(!Assert.isArray({}, undefined, false));
    assert.ok(!Assert.isArray(new Object({}), undefined, false));
    assert.ok(Assert.isArray([], undefined, false));
    assert.ok(Assert.isArray(new Object([]), undefined, false));
    assert.ok(!Assert.isArray(new Date(), undefined, false));
    assert.ok(!Assert.isArray(new Error(), undefined, false));
    assert.ok(!Assert.isArray(null, undefined, false));
    assert.ok(!Assert.isArray(undefined, undefined, false));
    assert.ok(!Assert.isArray(1, undefined, false));
    assert.ok(!Assert.isArray(1.1, undefined, false));
    assert.ok(!Assert.isArray('', undefined, false));
    assert.ok(!Assert.isArray('string', undefined, false));
    //
    assert.throws(() => Assert.isArray({}), IllegalArgumentError);
    assert.throws(() => Assert.isArray(new Object({})), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isArray([]));
    assert.doesNotThrow(() => Assert.isArray(new Object([])));
    assert.throws(() => Assert.isArray(new Date()), IllegalArgumentError);
    assert.throws(() => Assert.isArray(new Error()), IllegalArgumentError);
    assert.throws(() => Assert.isArray(null), IllegalArgumentError);
    assert.throws(() => Assert.isArray(undefined), IllegalArgumentError);
    assert.throws(() => Assert.isArray(1), IllegalArgumentError);
    assert.throws(() => Assert.isArray(1.1), IllegalArgumentError);
    assert.throws(() => Assert.isArray(''), IllegalArgumentError);
    assert.throws(() => Assert.isArray('string'), IllegalArgumentError);
  });

  it('should validate if string', function () {
    assert.ok(!validator.isString({}));
    assert.ok(!validator.isString(new Object({})));
    assert.ok(!validator.isString([]));
    assert.ok(!validator.isString(new Object([])));
    assert.ok(!validator.isString(new Date()));
    assert.ok(!validator.isString(new Error()));
    assert.ok(!validator.isString(null));
    assert.ok(!validator.isString(undefined));
    assert.ok(!validator.isString(1));
    assert.ok(!validator.isString(1.1));
    assert.ok(validator.isString(''));
    assert.ok(validator.isString('string'));
    //
    assert.ok(!Assert.isString({}, undefined, false));
    assert.ok(!Assert.isString(new Object({}), undefined, false));
    assert.ok(!Assert.isString([], undefined, false));
    assert.ok(!Assert.isString(new Object([]), undefined, false));
    assert.ok(!Assert.isString(new Date(), undefined, false));
    assert.ok(!Assert.isString(new Error(), undefined, false));
    assert.ok(!Assert.isString(null, undefined, false));
    assert.ok(!Assert.isString(undefined, undefined, false));
    assert.ok(!Assert.isString(1, undefined, false));
    assert.ok(!Assert.isString(1.1, undefined, false));
    assert.ok(Assert.isString('', undefined, false));
    assert.ok(Assert.isString('string', undefined, false));
    //
    assert.throws(() => Assert.isString({}), IllegalArgumentError);
    assert.throws(() => Assert.isString(new Object({})), IllegalArgumentError);
    assert.throws(() => Assert.isString([]), IllegalArgumentError);
    assert.throws(() => Assert.isString(new Object([])), IllegalArgumentError);
    assert.throws(() => Assert.isString(new Date()), IllegalArgumentError);
    assert.throws(() => Assert.isString(new Error()), IllegalArgumentError);
    assert.throws(() => Assert.isString(null), IllegalArgumentError);
    assert.throws(() => Assert.isString(undefined), IllegalArgumentError);
    assert.throws(() => Assert.isString(1), IllegalArgumentError);
    assert.throws(() => Assert.isString(1.1), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isString(''));
    assert.doesNotThrow(() => Assert.isString('string'));
  });

  it('should validate if type Error', function () {
    assert.ok(!validator.isError({}));
    assert.ok(!validator.isError(new Object({})));
    assert.ok(!validator.isError([]));
    assert.ok(!validator.isError(new Object([])));
    assert.ok(!validator.isError(new Date()));
    assert.ok(validator.isError(new Error()));
    assert.ok(validator.isError(Error));
    assert.ok(validator.isError(IllegalArgumentError));
    assert.ok(!validator.isError(null));
    assert.ok(!validator.isError(undefined));
    assert.ok(!validator.isError(1));
    assert.ok(!validator.isError(1.1));
    assert.ok(!validator.isError(''));
    assert.ok(!validator.isError('string'));
    //
    assert.ok(!Assert.isError({}, undefined, false));
    assert.ok(!Assert.isError(new Object({}), undefined, false));
    assert.ok(!Assert.isError([], undefined, false));
    assert.ok(!Assert.isError(new Object([]), undefined, false));
    assert.ok(!Assert.isError(new Date(), undefined, false));
    assert.ok(Assert.isError(new Error(), undefined, false));
    assert.ok(Assert.isError(Error, undefined, false));
    assert.ok(Assert.isError(IllegalArgumentError, undefined, false));
    assert.ok(!Assert.isError(null, undefined, false));
    assert.ok(!Assert.isError(undefined, undefined, false));
    assert.ok(!Assert.isError(1, undefined, false));
    assert.ok(!Assert.isError(1.1, undefined, false));
    assert.ok(!Assert.isError('', undefined, false));
    assert.ok(!Assert.isError('string', undefined, false));
    //
    assert.throws(() => Assert.isError({}), IllegalArgumentError);
    assert.throws(() => Assert.isError(new Object({})), IllegalArgumentError);
    assert.throws(() => Assert.isError([]), IllegalArgumentError);
    assert.throws(() => Assert.isError(new Object([])), IllegalArgumentError);
    assert.throws(() => Assert.isError(new Date()), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isError(new Error()));
    assert.doesNotThrow(() => Assert.isError(Error));
    assert.doesNotThrow(() => Assert.isError(IllegalArgumentError));
    assert.throws(() => Assert.isError(null), IllegalArgumentError);
    assert.throws(() => Assert.isError(undefined), IllegalArgumentError);
    assert.throws(() => Assert.isError(1), IllegalArgumentError);
    assert.throws(() => Assert.isError(1.1), IllegalArgumentError);
    assert.throws(() => Assert.isError(''), IllegalArgumentError);
    assert.throws(() => Assert.isError('string'), IllegalArgumentError);
  });

  it('should validate if empty', function () {
    assert.ok(validator.isEmpty({}));
    assert.ok(validator.isEmpty(new Object({})));
    assert.ok(validator.isEmpty([]));
    assert.ok(validator.isEmpty(new Object([])));
    assert.ok(!validator.isEmpty(new Date()));
    assert.ok(!validator.isEmpty(new Error()));
    assert.ok(validator.isEmpty(null));
    assert.ok(validator.isEmpty(undefined));
    assert.ok(!validator.isEmpty(1));
    assert.ok(!validator.isEmpty(1.1));
    assert.ok(validator.isEmpty(''));
    assert.ok(!validator.isEmpty('string'));
    //
    assert.ok(Assert.isEmpty({}, undefined, false));
    assert.ok(Assert.isEmpty(new Object({}), undefined, false));
    assert.ok(Assert.isEmpty([], undefined, false));
    assert.ok(Assert.isEmpty(new Object([]), undefined, false));
    assert.ok(!Assert.isEmpty(new Date(), undefined, false));
    assert.ok(!Assert.isEmpty(new Error(), undefined, false));
    assert.ok(Assert.isEmpty(null, undefined, false));
    assert.ok(Assert.isEmpty(undefined, undefined, false));
    assert.ok(!Assert.isEmpty(1, undefined, false));
    assert.ok(!Assert.isEmpty(1.1, undefined, false));
    assert.ok(Assert.isEmpty('', undefined, false));
    assert.ok(!Assert.isEmpty('string', undefined, false));
    //
    assert.doesNotThrow(() => Assert.isEmpty({}));
    assert.doesNotThrow(() => Assert.isEmpty(new Object({})));
    assert.doesNotThrow(() => Assert.isEmpty([]));
    assert.doesNotThrow(() => Assert.isEmpty(new Object([])));
    assert.throws(() => Assert.isEmpty(new Date()), IllegalArgumentError);
    assert.throws(() => Assert.isEmpty(new Error()), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isEmpty(null));
    assert.doesNotThrow(() => Assert.isEmpty(undefined));
    assert.throws(() => Assert.isEmpty(1), IllegalArgumentError);
    assert.throws(() => Assert.isEmpty(1.1), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isEmpty(''));
    assert.throws(() => Assert.isEmpty('string'), IllegalArgumentError);
  });

  it('should validate if string and blank', function () {
    assert.ok(!validator.isBlank({}));
    assert.ok(!validator.isBlank(new Object({})));
    assert.ok(!validator.isBlank([]));
    assert.ok(!validator.isBlank(new Object([])));
    assert.ok(!validator.isBlank(new Date()));
    assert.ok(!validator.isBlank(new Error()));
    assert.ok(!validator.isBlank(null));
    assert.ok(!validator.isBlank(undefined));
    assert.ok(!validator.isBlank(1));
    assert.ok(!validator.isBlank(1.1));
    assert.ok(validator.isBlank(''));
    assert.ok(!validator.isBlank('string'));
    //
    assert.ok(!Assert.isBlank({}, undefined, false));
    assert.ok(!Assert.isBlank(new Object({}), undefined, false));
    assert.ok(!Assert.isBlank([], undefined, false));
    assert.ok(!Assert.isBlank(new Object([]), undefined, false));
    assert.ok(!Assert.isBlank(new Date(), undefined, false));
    assert.ok(!Assert.isBlank(new Error(), undefined, false));
    assert.ok(!Assert.isBlank(null, undefined, false));
    assert.ok(!Assert.isBlank(undefined, undefined, false));
    assert.ok(!Assert.isBlank(1, undefined, false));
    assert.ok(!Assert.isBlank(1.1, undefined, false));
    assert.ok(Assert.isBlank('', undefined, false));
    assert.ok(!Assert.isBlank('string', undefined, false));
    //
    assert.throws(() => Assert.isBlank({}), IllegalArgumentError);
    assert.throws(() => Assert.isBlank(new Object({})), IllegalArgumentError);
    assert.throws(() => Assert.isBlank([]), IllegalArgumentError);
    assert.throws(() => Assert.isBlank(new Object([])), IllegalArgumentError);
    assert.throws(() => Assert.isBlank(new Date()), IllegalArgumentError);
    assert.throws(() => Assert.isBlank(new Error()), IllegalArgumentError);
    assert.throws(() => Assert.isBlank(null), IllegalArgumentError);
    assert.throws(() => Assert.isBlank(undefined), IllegalArgumentError);
    assert.throws(() => Assert.isBlank(1), IllegalArgumentError);
    assert.throws(() => Assert.isBlank(1.1), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isBlank(''));
    assert.throws(() => Assert.isBlank('string'), IllegalArgumentError);
  });

  it('should validate if string and not blank', function () {
    assert.ok(!validator.isNotBlank({}));
    assert.ok(!validator.isNotBlank(new Object({})));
    assert.ok(!validator.isNotBlank([]));
    assert.ok(!validator.isNotBlank(new Object([])));
    assert.ok(!validator.isNotBlank(new Date()));
    assert.ok(!validator.isNotBlank(new Error()));
    assert.ok(!validator.isNotBlank(null));
    assert.ok(!validator.isNotBlank(undefined));
    assert.ok(!validator.isNotBlank(1));
    assert.ok(!validator.isNotBlank(1.1));
    assert.ok(!validator.isNotBlank(' '));
    assert.ok(validator.isNotBlank('string'));
    //
    assert.ok(!Assert.isNotBlank({}, undefined, false));
    assert.ok(!Assert.isNotBlank(new Object({}), undefined, false));
    assert.ok(!Assert.isNotBlank([], undefined, false));
    assert.ok(!Assert.isNotBlank(new Object([]), undefined, false));
    assert.ok(!Assert.isNotBlank(new Date(), undefined, false));
    assert.ok(!Assert.isNotBlank(new Error(), undefined, false));
    assert.ok(!Assert.isNotBlank(null, undefined, false));
    assert.ok(!Assert.isNotBlank(undefined, undefined, false));
    assert.ok(!Assert.isNotBlank(1, undefined, false));
    assert.ok(!Assert.isNotBlank(1.1, undefined, false));
    assert.ok(!Assert.isNotBlank(' ', undefined, false));
    assert.ok(Assert.isNotBlank('string', undefined, false));
    //
    assert.throws(() => Assert.isNotBlank({}), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(new Object({})), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank([]), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(new Object([])), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(new Date()), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(new Error()), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(null), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(undefined), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(1), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(1.1), IllegalArgumentError);
    assert.throws(() => Assert.isNotBlank(' '), IllegalArgumentError);
    assert.doesNotThrow(() => Assert.isNotBlank('string'));
  });

  it('should work w/o Error.captureStackTrace support', function () {
    const buf = Error.captureStackTrace;
    Error.captureStackTrace = undefined;

    assert.throws(() => Assert.isBlank({}), IllegalArgumentError);

    Error.captureStackTrace = buf;
  });

});