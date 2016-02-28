'use strict';

const co = require('co');
const MongoDB = require('..');

const db = new MongoDB('mongodb://localhost:27017/myproject');
// listen db connect error event
db.on('error', err => {
  console.error(err);
});
// wait for db connected
db.ready(() => {
  // let's read and write
  co(function*() {
    const result = yield db.collection('user').insertMany([
      { name: 'fengmk2', type: 'JavaScript' },
      { name: 'dead-horse', type: 'JavaScript' },
      { name: 'tj', type: 'go' },
    ]);
    console.log(result);

    const docs = yield db.collection('user').find({ type: 'JavaScript' }).skip(10).toArray();
    console.log(docs);
  }).catch(err => {
    console.error(err);
    console.error(err.stack);
    process.exit(1);
  });
});
