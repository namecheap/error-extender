'use strict';

function initialProperties(name) {
  return {
    name: { value: name, enumerable: false, writable: false, configurable: false },
    message: { enumerable: false, writable: false, configurable: false },
    context: { enumerable: false, writable: false, configurable: false },
    cause: { enumerable: false, writable: false, configurable: false }
  }
}

function defineReadOnly(target, propertyName, value) {
  Object.defineProperty(target, propertyName, {
    value: value, enumerable: false, writable: false, configurable: false
  });
}

function processParams(target, params) {
  if (!params || params.length === 0) {
    return;
  }
  if ('string' === typeof params[0]) {
    defineReadOnly(target, 'message', params.shift());
  }
  if (params.length === 0) {
    return;
  } else if (params[params.length - 1] instanceof Error) {
    const cause = params.pop();
    defineReadOnly(target, 'cause', cause);
    defineReadOnly(target, 'stack', `${target.stack}\nCaused by: ${cause.stack || cause}`)
  }
  if (params.length === 0) {
    return;
  } else if (params.length === 1) {
    defineReadOnly(target, 'context', params[0]);
  } else {
    defineReadOnly(target, 'context', params);
  }
}

function extend(newErrorName, ParentErrorType = Error) {
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
  defineReadOnly(ExtendedError.prototype.constructor, 'name', constructorName);
  defineReadOnly(ExtendedError.prototype.constructor, 'toString', () => `[${constructorName}]`);
  return ExtendedError;
}

module.exports = extend;
