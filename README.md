# error-extender v1.0.0

Simplifies creation of custom `Error` classes for Node.js.

## The inspiration (thanks [`bluebird`](https://www.npmjs.com/package/bluebird)!):

```javascript
const Promise = require('bluebird');
// ...
const extendError = require('error-extender');
// ...
const ServiceError = extendError('ServiceError');
const ServiceStateError = extendError('ServiceStateError', ServiceError);
// ...
function aServiceFunction() {
  return new Promise(
    function (resolve, reject) {
      // ... multiple things that may throw your
      //     custom "expected" errors
    })
    .catch(ServiceStateError, function (error) {
      // ... your "common way" of handling
      // ... ServiceUnavailableError
    })
    .catch(ServiceError, function (error) {
      // ... your "common generc way" of handling
      // ... ServiceError
    })
    .catch(function (error) {
      // ... the "catch all"
    });
}
```

With JavaScript, I felt quite stifled when I was limited to:

1) Do selective/custom handling based on matching messages from `throw new Error('..')`.
1) Return/propagate [JSend](https://labs.omniti.com/labs/jsend)-like responses to function "callers"/"users".
1) ... or whatever error possible passing/handling could be done, throughout functions and callers/users.

With **`error-extender`** with help from [syntactic-sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) from [`bluebird`](https://www.npmjs.com/package/bluebird), you can improve _(or even standardize)_ your way of propagating/handling errors throughout your application.
callers.

## Features

### "Extending" Errors

### "Extended Errors"

"Extended Errors" would accept up to **3 arguments** for constructing/instantiating _(hello "pseudo-method-overloading" for JavaScript)_:

```javascript
const extendError = require('error-extender');
const ExtendedError = extendError('ServiceError');
throw new ExtendedError([message[, context[, cause]]]);
throw ExtendedError([message[, context[, cause]]]);
```

Yes, much like JavaScript's native `Error`, "Extended Errors" can be written/used "factory-like" (without the `new` keyword).

Examples:
```javascript
throw new ExtendedError();

throw new ExtendedError('An error has occurred.');

throw new ExtendedError({refId: 'abc123'});

throw new ExtendedError('An error has occurred.', {refId: 'abc123'});

try {
  // ...
} catch (error) {
  throw new ExtendedError(error);
  // or
  throw new ExtendedError('Something occurred.', error);
  // or
  throw new ExtendedError({refId: 'abc123'}, error);
  // or
  throw new ExtendedError('Something occurred.', {refId: 'abc123'}, error);
}
```

**Note**: The first argument/parameter, if it's `'string' === typeof arg[0]`, it would always be used as "message". If you want to use a `'string'` context with blank message:

```javascript
const extendError = require('../main/ErrorExtender');
// ...
const ServiceError = extendError('ServiceError');
// ...
const referenceId = require('uuid/v4')();
// ...
throw new ServiceError(null, referenceId);
```

```javascript
const extendError = require('error-extender');
// ...
const ServiceError = extendError('ServiceError');
// ...
const referenceId = require('uuid/v4')();
// ...
try {
  // ...
} catch (error) {
  throw new ServiceError('An error has occurred.', referenceId, error);
}
```

1) Creates prototype-based `Error` classes (child/subclass) : _"Extended Errors"_.
1) Those _"Extended Errors"_, accepts `cause` (`Error`); very much like how it is with Java `Exception`.
1) Appends stack of `cause` to the bottom of instantiated _"Extended Errors"_ stack.
1) _"Extended Errors"_ arguments/properties _(w/ optional `new`)_:
    1) `new ExtendedError([message[, context[, cause]]])`
    1) `ExtendedError([message[, context[, cause]]])`

## Basic Usage

## License

### MIT License

#### Copyright (c) 2018 Joseph Baking

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.**
