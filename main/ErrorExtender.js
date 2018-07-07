'use strict';

const Assert = require('./helpers/Assert');

const hro = require('./helpers/HiddenReadOnly');

function get(target, key, keyAlias) {
  return target[key] || target[keyAlias];
}

function getMessage(target) {
  return target && get(target, 'm', 'message');
}

function getData(target) {
  return target && get(target, 'd', 'data');
}

function captureCause(target, options) {
  const cause = options && get(options, 'c', 'cause');
  if (cause) {
    Assert.isError(cause, '`cause` must be a valid Error (instanceof)');
    hro(target, 'cause', cause);
    hro(target, 'stack', `${target.stack}\nCaused by: ${cause.stack || cause.toString()}`);
  }
}

function captureProperties(target, options) {
  hro(target, 'message', getMessage(options) || target.message);
  hro(target, 'data', getData(options) || target.data);
  captureCause(target, options);
}

function createExtendedErrorType(newErrorName, ParentErrorType, defaultMessage, defaultData) {

  function ExtendedErrorType(options = {}) {
    Assert.isObject(options, '`options` must be an object literal (ie: `{}`)');
    if (!(this instanceof ExtendedErrorType)) {
      return new ExtendedErrorType(options);
    }
    Error.captureStackTrace(this, this.constructor);
    captureProperties(this, options);
  }

  // base
  ExtendedErrorType.prototype = Object.create(ParentErrorType.prototype);
  ExtendedErrorType.prototype.constructor = ExtendedErrorType;

  // name
  ExtendedErrorType.prototype.name = newErrorName;
  const constructorName = `Created by error-extender: "${newErrorName}"`;
  hro(ExtendedErrorType.prototype.constructor, 'name', constructorName);
  ExtendedErrorType.prototype.constructor.toString = () => `[${constructorName}]`;

  // properties
  ExtendedErrorType.prototype.message = defaultMessage;
  ExtendedErrorType.prototype.data = defaultData;
  ExtendedErrorType.prototype.cause = undefined;

  // return
  return ExtendedErrorType;

}

function extend(newErrorName, options = { parent: undefined, defaultMessage: undefined, defaultData: undefined }) {
  Assert.isNotBlank(newErrorName, '`newErrorName` cannot be blank');
  Assert.isObject(options, '`options` must be an object literal (ie: `{}`)');
  let parent = options.parent || Error;
  Assert.isError(parent, '`options.parent` is not a valid `Error`');
  return createExtendedErrorType(
    newErrorName, parent,
    options.defaultMessage, options.defaultData);
}

module.exports = extend;
