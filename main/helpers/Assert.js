'use strict';

const hro = require('./HiddenReadOnly');

function IllegalArgumentError(message) {
  if (!(this instanceof IllegalArgumentError)) {
    return new IllegalArgumentError(message);
  }

  // Maintains proper stack trace for where our error was thrown (only available on V8)
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }

  hro(this, 'message', message);
  const stackArr = this.stack.split('\n');
  hro(this, 'stack', `${stackArr[0]}\n${stackArr[5]}`);
}
IllegalArgumentError.prototype = Object.create(Error.prototype);
IllegalArgumentError.prototype.constructor = IllegalArgumentError;
hro(IllegalArgumentError.prototype.constructor, 'name', 'IllegalArgumentError');
hro(IllegalArgumentError.prototype.constructor, 'toString', () => '[IllegalArgumentError]');
hro(IllegalArgumentError.prototype, 'name', 'IllegalArgumentError');

function error(message) {
  return IllegalArgumentError(message);
}

const validator = {
  isTruthy: (o) => !!o,
  isFalsy: (o) => !(!!o),
  isUndefined: (o) => o === undefined,
  isNull: (o) => o === null,
  isObject: (o) => !!o && o.constructor === Object,
  isArray: (o) => !!o && Array.isArray(o),
  isString: (o) => 'string' === typeof o,
  isError: (o) => !!o && (o instanceof Error || (() => { try { return (new o() instanceof Error); } catch (_) { return false; } })()),
  isEmpty: (o) => validator.isUndefined(o) || validator.isNull(o) || (validator.isString(o) && o.length === 0) || (validator.isArray(o) && o.length === 0) || (validator.isObject(o) && Object.keys(o).length === 0),
  isBlank: (o) => validator.isString(o) && o.trim().length === 0,
  isNotBlank: (o) => validator.isString(o) && o.trim().length > 0
};

function validate(isOk, m, throwError) {
  if (!isOk) {
    if (throwError) {
      throw error(m);
    }
    else {
      return false;
    }
  }
  return true;
}

function isTruthy(o, message, throwError = true) {
  return validate(validator.isTruthy(o),
    message || 'should be truthy', throwError);
}

function isFalsy(o, message, throwError = true) {
  return validate(validator.isFalsy(o),
    message || 'should be falsy', throwError);
}

function isObject(o, message, throwError = true) {
  return validate(validator.isObject(o),
    message || 'should be an object literal', throwError);
}

function isArray(o, message, throwError = true) {
  return validate(validator.isArray(o),
    message || 'should be a valid array', throwError);
}

function isString(o, message, throwError = true) {
  return validate(validator.isString(o),
    message || 'should be a valid string', throwError);
}

function isError(o, message, throwError = true) {
  return validate(validator.isError(o),
    message || 'should be a valid type/prototype of `Error`', throwError);
}

function isEmpty(o, message, throwError = true) {
  return validate(validator.isEmpty(o),
    message || 'should be empty', throwError);
}

function isBlank(o, message, throwError = true) {
  return validate(validator.isBlank(o),
    message || 'should be blank', throwError);
}

function isNotBlank(o, message, throwError = true) {
  return validate(validator.isNotBlank(o),
    message || 'should be blank', throwError);
}

module.exports = {
  IllegalArgumentError,
  validator,
  isTruthy,
  isFalsy,
  isObject,
  isArray,
  isString,
  isError,
  isEmpty,
  isBlank,
  isNotBlank
};
