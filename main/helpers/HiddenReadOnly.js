'use strict';

const config = require('./HiddenReadOnlyConfig');

function hiddenReadOnly(o, key, value) {
    let c = config();
    c.value = value;
    Object.defineProperty(o, key, c);
}

module.exports = hiddenReadOnly;