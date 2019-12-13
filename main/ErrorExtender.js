'use strict';

const Assert = require('./helpers/Assert');
const validator = Assert.validator;

const hro = require('./helpers/HiddenReadOnly');
const merge = require('./helpers/Merge');

function configurePrototype(ExtendedErrorType, ParentErrorType) {
  hro(ExtendedErrorType, 'prototype', Object.create(ParentErrorType.prototype));
  hro(ExtendedErrorType.prototype, 'constructor', ExtendedErrorType);
}

function configureName(ExtendedErrorType, newErrorName) {
  hro(ExtendedErrorType.prototype, 'name', newErrorName);
  const constructorName = `Created by error-extender: "${newErrorName}"`;
  hro(ExtendedErrorType.prototype.constructor, 'name', constructorName);
  hro(ExtendedErrorType.prototype.constructor, 'toString', () => `[${constructorName}]`);
}

function configureDefaultMessage(ExtendedErrorType, ParentErrorType, defaultMessage) {
  let mergedDefaultMessage;
  if (validator.isNotBlank(defaultMessage)) {
    mergedDefaultMessage = defaultMessage;
  } else {
    mergedDefaultMessage = ParentErrorType.defaultMessage;
  }
  hro(ExtendedErrorType.prototype.constructor, 'defaultMessage', mergedDefaultMessage);
}

function configureDefaultData(ExtendedErrorType, ParentErrorType, defaultData) {
  let mergedDefaultData;
  if (validator.isObject(defaultData) && validator.isObject(ParentErrorType.defaultData)) {
    mergedDefaultData = merge(ParentErrorType.defaultData, defaultData);
  } else {
    mergedDefaultData = defaultData;
  }
  hro(ExtendedErrorType.prototype.constructor, 'defaultData', mergedDefaultData);
}

function configureProperties(ExtendedErrorType) {
  hro(ExtendedErrorType.prototype, 'message', undefined);
  hro(ExtendedErrorType.prototype, 'data', undefined);
  hro(ExtendedErrorType.prototype, 'cause', undefined);
}

function capture(target, key, keyAlias) {
  return target[key] || target[keyAlias];
}

function captureMessage(target, options) {
  const message = options && capture(options, 'm', 'message');
  let mergedMessage;
  if (validator.isNotBlank(message)) {
    mergedMessage = message;
  } else {
    mergedMessage = target.constructor.defaultMessage;
  }
  hro(target, 'message', mergedMessage);
}

function captureData(target, options) {
  const data = (options && capture(options, 'd', 'data'));
  let mergedData;
  if (validator.isObject(data) && validator.isObject(target.constructor.defaultData)) {
    mergedData = merge(target.constructor.defaultData, data);
  } else if (!validator.isUndefined(data)) {
    mergedData = data;
  } else {
    mergedData = target.constructor.defaultData;
  }
  hro(target, 'data', mergedData);
}

function captureCause(target, options) {
  const cause = options && capture(options, 'c', 'cause');
  if (cause) {
    Assert.isError(cause, '`cause` must be a valid `Error` (instanceof)');
    hro(target, 'cause', cause);
    hro(target, 'stack', `${target.stack}\nCaused by: ${cause.stack || cause.toString()}`);
  }
}

function captureProperties(target, options) {
  captureMessage(target, options);
  captureData(target, options);
  captureCause(target, options);
}

function createExtendedErrorType(newErrorName, ParentErrorType, defaultMessage, defaultData) {
  function ExtendedErrorType(options = {}) {
    Assert.isObject(options, '`options` must be an object literal (ie: `{}`)');
    if (!(this instanceof ExtendedErrorType)) {
      return new ExtendedErrorType(options);
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    captureProperties(this, options);
  }
  configurePrototype(ExtendedErrorType, ParentErrorType);
  configureName(ExtendedErrorType, newErrorName);
  configureDefaultMessage(ExtendedErrorType, ParentErrorType, defaultMessage);
  configureDefaultData(ExtendedErrorType, ParentErrorType, defaultData);
  configureProperties(ExtendedErrorType);
  return ExtendedErrorType;
}

function extend(newErrorName, options = { parent: undefined, defaultMessage: undefined, defaultData: undefined }) {
  Assert.isNotBlank(newErrorName, '`newErrorName` cannot be blank');
  Assert.isObject(options, '`options` must be an object literal (ie: `{}`)');
  let parent = options.parent || Error;
  Assert.isError(parent, '`options.parent` is not a valid `Error`');
  return createExtendedErrorType(newErrorName, parent,
    options.defaultMessage, options.defaultData);
}

module.exports = extend;
