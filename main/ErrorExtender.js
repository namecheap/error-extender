'use strict';

const Assert = require('./helpers/Assert');
const validator = require('./helpers/Assert').validator;

const hro = require('./helpers/HiddenReadOnly');
const hroConfig = require('./helpers/HiddenReadOnlyConfig');

function initialProperties(name) {
  return { name: hroConfig(name), message: hroConfig(), context: hroConfig(), cause: hroConfig() }
}

function processParams(target, params) {
  if (validator.isEmpty(params)) {
    return;
  }
  if ('string' === typeof params[0]) {
    hro(target, 'message', params.shift());
  }
  if (validator.isEmpty(params)) {
    return;
  } else if (validator.isError(params[params.length - 1])) {
    const cause = params.pop();
    hro(target, 'cause', cause);
    hro(target, 'stack', `${target.stack}\nCaused by: ${cause.stack || cause}`)
  }
  if (validator.isEmpty(params)) {
    return;
  } else if (params.length === 1) {
    hro(target, 'context', params[0]);
  } else {
    hro(target, 'context', params);
  }
}

function extend(newErrorName, ParentErrorType = Error) {
  Assert.isNotBlank(newErrorName, '`newErrorName` cannot be blank');
  Assert.isError(ParentErrorType, '`ParentErrorType` is not a valid `Error`');
  function ExtendedError(...params) {
    if (!(this instanceof ExtendedError)) {
      return new ExtendedError(...params);
    }
    Error.captureStackTrace(this, this.constructor);
    processParams(this, params);
  }
  ExtendedError.prototype = Object.create(
    ParentErrorType.prototype,
    initialProperties(newErrorName));
  ExtendedError.prototype.constructor = ExtendedError;
  const constructorName = `Created by error-extender: "${newErrorName}"`;
  hro(ExtendedError.prototype.constructor, 'name', constructorName);
  hro(ExtendedError.prototype.constructor, 'toString', () => `[${constructorName}]`);
  return ExtendedError;
}

module.exports = extend;
