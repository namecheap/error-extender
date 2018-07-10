# error-extender-1.0.2

Simplifies creation of custom `Error` classes for Node.js!

...which then produces `stack` with appended stacks of supplied `cause` _(very much like in Java)_!

```javascript
const extendError = require('error-extender');

const CustomError = extendError('CustomError');

const rootCause = new Error('the root cause');

console.log(new CustomError({ message: 'An error has occurred.', cause: rootCause }));
```

Shall output:

```
CustomError: An error has occurred.
    at Object.<anonymous> (/opt/app/index.js:7:13)
    at Module._compile (internal/modules/cjs/loader.js:702:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:713:10)
    at Module.load (internal/modules/cjs/loader.js:612:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:551:12)
    at Function.Module._load (internal/modules/cjs/loader.js:543:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:744:10)
    at startup (internal/bootstrap/node.js:240:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:564:3)
Caused by: Error: the root cause
    at Object.<anonymous> (/opt/app/index.js:5:19)
    at Module._compile (internal/modules/cjs/loader.js:702:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:713:10)
    at Module.load (internal/modules/cjs/loader.js:612:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:551:12)
    at Function.Module._load (internal/modules/cjs/loader.js:543:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:744:10)
    at startup (internal/bootstrap/node.js:240:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:564:3)
```

### 100% Code Coverage
Oh, by the way, 100% test coverage. See for yourself (via `npm test`)!

## Features

### "Extending" Errors

It's quite simple! See below:

```javascript
const extendError = require('error-extender');

const AppError = extendError('AppError'); // extends `Error` (default)
```

Or... A bit more complex using the second argument _(options)_:

```javascript
const extendError = require('error-extender');

const AppError = extendError('AppError', {
  defaultMessage: 'An unhandled error has occurred.',
  defaultData: { status: 503, message: 'An unhandled error has occurred.' }
});

const ServiceError = extendError('ServiceError', {
  parent: AppError, // extends `AppError`
  defaultMessage: 'A service error has occurred.',
  defaultData: { status: 500, message: 'A service error has occurred.' }
});

const DatabaseError = extendError('DatabaseError', {
  parent: ServiceError, // extends `ServiceError`
  defaultMessage: 'A service database error has occurred.',
  defaultData: { message: 'A service database error has occurred.' }
});

require('assert').deepStrictEqual(
  DatabaseError.defaultData, {
    status: 500,
    message: 'A service database error has occurred.'
  });
// no error
```

Yes, `defaultData` merges!

#### `error-extender` Arguments

`error-extender` accepts a single [object literal](https://www.w3schools.com/js/js_objects.asp) as second argument.

The options (object literal keys) are as follows:

| key              | expected type                              |
| ---------------- | ------------------------------------------ |
| `parent`         | `Error.prototype` _or one that extends it_ |
| `defaultMessage` | `string`                                   |
| `defaultData`    | `any`                                      |

### "Extended Errors"

1) Creates prototype-based `Error` classes (child/subclass) : _"Extended Errors"_.
1) Those _"Extended Errors"_, accepts `cause` (`Error`); very much like how it is with Java `Exception`.
1) Appends stack of `cause` to the bottom of instantiated _"Extended Errors"_ stack.
1) _"Extended Errors"_ constructor & argument _(w/ optional `new`)_:
    1) `new ExtendedError(options)`
    1) `ExtendedError(options)`

Yes, much like JavaScript's native `Error`, "Extended Errors" can be written/used "factory-like" (without the `new` keyword).

#### "Extended Errors" Arguments (constructor)

"Extended Errors" accepts a single [object literal](https://www.w3schools.com/js/js_objects.asp) as argument:

```javascript
const extendError = require('error-extender');
const ServiceError = extendError('ServiceError');
try {
  // ... something throws something
} catch (error) {
  throw new ServiceError({
    message: 'An error has occurred',
    data: { ref: '7e9f876ca116' },
    cause: error
  });
}
```

The options (object literal keys) are as follows:

| key       | alias | expected type       |
| :-------- | :---: | ------------------- |
| `message` | `m`   | `string`            |
| `data`    | `d`   | `any`               |
| `cause`   | `c`   | `instancedof Error` |

Given the alias, you may construct extended errors by:

```javascript
const extendError = require('error-extender');
const ServiceError = extendError('ServiceError');
try {
  // ... something throws something
} catch (error) {
  throw new ServiceError({
    m: 'An error has occurred',
    d: { ref: '7e9f876ca116' },
    c: error
  });
}
```

**Note**: Aliases are evaluated first; hence if you have both `m` and `message`, if `m`'s value is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), then `m`'s value will be used.

#### Instance Properties

As with `Error`, "Extended Errors" would have the following properties:

* `name`
* `message`
* `stack`

... "Extended Errors" shall have the following additiona properties:

* `data` - _(as set in constructor args)_
* `cause` - _(as set in constructor args)_

#### `data` merging w/ `defaultData`

Yes, you heard right, instance `data` merges with `defaultData`!!!

See example below:

```javascript
const extendError = require('error-extender');

const AppError = extendError('ServiceError', {
  defaultData: { status: 503, message: 'An unhandled error has occurred.' }
});

const appError = new AppError({ d: { status: 401 } });

require('assert').deepStrictEqual(
  appError.data, {
    status: 401,
    message: 'An unhandled error has occurred.'
  });
// no error
```

## The inspiration (thanks [`bluebird`](https://www.npmjs.com/package/bluebird)!):

```javascript
const Promise = require('bluebird');
// ...
const extendError = require('error-extender');
// ...
const ServiceError = extendError('ServiceError');
const ServiceStateError = extendError(
  'ServiceStateError',
  { parent: ServiceError });
// ...
function aServiceFunction() {
  return new Promise(
    function (resolve, reject) {
      // ... multiple things that may throw your
      //     custom "expected" errors
    })
    .catch(ServiceStateError, function (error) {
      // ... your "common way" of handling
      //     ServiceStateError
      // ... then propagate
    })
    .catch(ServiceError, function (error) {
      // ... your "common generc way" of handling
      //     ServiceError
      // ... then propagate
    })
    .catch(function (error) {
      // ... the "catch all"
      // ... then propagate
    });
}
```

With JavaScript, I felt quite stifled when I was limited to:

1) Do selective/custom handling based on matching messages from `throw new Error('..')`.
1) Return/propagate [JSend](https://labs.omniti.com/labs/jsend)-like responses to function "callers"/"users".
1) ... or whatever error possible passing/handling could be done, throughout functions and callers/users.

With **`error-extender`** with help from [syntactic-sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) from [`bluebird`](https://www.npmjs.com/package/bluebird), you can improve _(or even standardize)_ your way of propagating/handling errors throughout your application.
callers.

## License

### MIT License

#### Copyright (c) 2018 Joseph Baking

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.**
