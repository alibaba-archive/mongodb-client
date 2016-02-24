mongodb-client
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/mongodb-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/mongodb-client
[travis-image]: https://img.shields.io/travis/node-modules/mongodb-client.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/mongodb-client
[codecov-image]: https://codecov.io/github/node-modules/mongodb-client/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/node-modules/mongodb-client?branch=master
[david-image]: https://img.shields.io/david/node-modules/mongodb-client.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/mongodb-client
[download-image]: https://img.shields.io/npm/dm/mongodb-client.svg?style=flat-square
[download-url]: https://npmjs.org/package/mongodb-client

A nice API client for MongoDB.

## Installation

```bash
$ npm install mongodb-client
```

## Quick start

```js
const co = require('co');
const MongoDB = require('mongodb-client');

const db = new MongoDB('mongodb://localhost:27017/myproject');

co(function*() {
  const cursor = db.find({ type: 'JavaScript' }).skip(10);
  const docs = yield cursor.toArray();
  console.log(docs);
});
```

## License

[MIT](LICENSE)

---

# APIs

## CURD

### Insert Documents

TBD

### Modify Documents

TBD

### Query Documents

TBD

### Remove Documents

## Indexes

TBD

## Aggregation

TBD

## Administration

TBD
