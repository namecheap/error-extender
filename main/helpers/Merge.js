'use strict';

const Assert = require('./Assert');
const validator = Assert.validator;

function merge(...objects) {
  let merged = {};
  const merger = function (object) {
    Object.keys(object).forEach((key) => {
      if (validator.isObject(merged[key]) && validator.isObject(object[key])) {
        merged[key] = merge(merged[key], object[key]);
      } else {
        merged[key] = object[key];
      }
    });
  }
  for (let index = 0; index < objects.length; index++) {
    const object = objects[index];
    Assert.isObject(object, `\`object\` at index \`${index}\` is not a valid object literla (ie: \`{}\`)`);
    merger(object);
  }
  return merged;
}

module.exports = merge;