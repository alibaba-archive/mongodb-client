/**
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const assert = require('assert');
const config = require('./config');
const MongoDB = require('..');

describe('test/index.test.js', function() {
  before(function(done) {
    this.db = new MongoDB(config.url);
    this.db.ready(done);
  });

  describe('admin()', function() {
    it('should check master status ok', function*() {
      const result = yield this.db.admin().command({ isMaster: 1 });
      // { ismaster: true,
      //   maxBsonObjectSize: 16777216,
      //   maxMessageSizeBytes: 48000000,
      //   maxWriteBatchSize: 1000,
      //   localTime: Sun Feb 28 2016 22:51:12 GMT+0800 (CST),
      //   maxWireVersion: 2,
      //   minWireVersion: 0,
      //   ok: 1 }
      assert.equal(result.ok, 1);
      assert.equal(result.ismaster, true);
    });
  });

  describe('insertOne()', function() {
    const collectionName = 'test_insert_one';

    it('should insert a new row', function*() {
      const result = yield this.db.collection(collectionName).insertOne({
        name: 'fengmk2',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      assert.deepEqual(Object.keys(result), [ 'result', 'connection', 'ops', 'insertedCount', 'insertedId' ]);
      assert.deepEqual(result.result, { ok: 1, n: 1 });
      assert.equal(result.insertedCount, 1);
      assert.equal(result.ops.length, 1);
      assert.equal(result.ops[0]._id, result.insertedId);
      // { result: { ok: 1, n: 1 },
      // connection: ...
      // ops:
      //  [ { name: 'fengmk2',
      //      createdAt: Sun Feb 28 2016 21:50:42 GMT+0800 (CST),
      //      updatedAt: Sun Feb 28 2016 21:50:42 GMT+0800 (CST),
      //      _id: 56d2fb320daeaf20ce51ddf3 } ],
      // insertedCount: 1,
      // insertedId: 56d2fb320daeaf20ce51ddf3 }
    });

    it('should disable forceServerObjectId: true option', function*() {
      const result = yield this.db.collection(collectionName).insertOne({
        name: 'fengmk2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        forceServerObjectId: true,
      });
      assert.deepEqual(Object.keys(result), [ 'result', 'connection', 'ops', 'insertedCount', 'insertedId' ]);
      assert.deepEqual(result.result, { ok: 1, n: 1 });
      assert.equal(result.insertedCount, 1);
      assert.equal(result.ops.length, 1);
      assert.equal(result.ops[0]._id, result.insertedId);
      assert(result.insertedId);
    });

    it('should work with options.writeConcern.w = 0', function*() {
      const result = yield this.db.collection(collectionName).insertOne({
        name: 'fengmk2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        writeConcern: {
          w: 0,
        },
      });
      assert.deepEqual(Object.keys(result), [ 'result', 'connection', 'ops', 'insertedCount', 'insertedId' ]);
      assert.deepEqual(result.result, { ok: 1 });
      // wont wait write acknowledge result return, so result dont know how the insert success or not
      assert.equal(result.insertedCount, undefined);
      assert.equal(result.ops.length, 1);
      assert.equal(result.ops[0]._id, result.insertedId);
      assert(result.insertedId);
    });
  });

  describe('insertMany()', function() {
    const collectionName = 'test_insert_many';

    it('should insert two new row', function*() {
      const result = yield this.db.collection(collectionName).insertMany([
        {
          name: 'fengmk2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'dead-horse',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      assert.deepEqual(Object.keys(result), [ 'result', 'ops', 'insertedCount', 'insertedIds' ]);
      assert.deepEqual(result.result, { ok: 1, n: 2 });
      assert.equal(result.insertedCount, 2);
      assert.equal(result.ops.length, 2);
      assert.equal(result.ops[0]._id, result.insertedIds[0]);
      assert.equal(result.ops[1]._id, result.insertedIds[1]);
      // { result: { ok: 1, n: 2 },
      // ops:
      //  [ { name: 'fengmk2',
      //      createdAt: Sun Feb 28 2016 22:03:10 GMT+0800 (CST),
      //      updatedAt: Sun Feb 28 2016 22:03:10 GMT+0800 (CST),
      //      _id: 56d2fe1e86d73ac4ce50a18a },
      //    { name: 'dead-horse',
      //      createdAt: Sun Feb 28 2016 22:03:10 GMT+0800 (CST),
      //      updatedAt: Sun Feb 28 2016 22:03:10 GMT+0800 (CST),
      //      _id: 56d2fe1e86d73ac4ce50a18b } ],
      // insertedCount: 2,
      // insertedIds:
      //  [ 56d2fe1e86d73ac4ce50a18a, 56d2fe1e86d73ac4ce50a18b ] }
    });

    it('should insert with options.ordered = false', function*() {
      const result = yield this.db.collection(collectionName).insertMany([
        {
          name: 'fengmk2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'dead-horse',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {
        ordered: false,
      });
      assert.deepEqual(Object.keys(result), [ 'result', 'ops', 'insertedCount', 'insertedIds' ]);
      assert.deepEqual(result.result, { ok: 1, n: 2 });
      assert.equal(result.insertedCount, 2);
      assert.equal(result.ops.length, 2);
      assert.equal(result.ops[0]._id, result.insertedIds[0]);
      assert.equal(result.ops[1]._id, result.insertedIds[1]);
      // { result: { ok: 1, n: 2 },
      // ops:
      //  [ { name: 'fengmk2',
      //      createdAt: Sun Feb 28 2016 22:03:10 GMT+0800 (CST),
      //      updatedAt: Sun Feb 28 2016 22:03:10 GMT+0800 (CST),
      //      _id: 56d2fe1e86d73ac4ce50a18a },
      //    { name: 'dead-horse',
      //      createdAt: Sun Feb 28 2016 22:03:10 GMT+0800 (CST),
      //      updatedAt: Sun Feb 28 2016 22:03:10 GMT+0800 (CST),
      //      _id: 56d2fe1e86d73ac4ce50a18b } ],
      // insertedCount: 2,
      // insertedIds:
      //  [ 56d2fe1e86d73ac4ce50a18a, 56d2fe1e86d73ac4ce50a18b ] }
    });

    it('should call insert() throw error', function*() {
      let err;
      try {
        yield this.db.collection(collectionName).insert({
          name: 'fengmk2',
        });
      } catch (e) {
        err = e;
      }
      assert(err, 'should throw error');
      assert.equal(err.message, 'insert() method was removed, please use insertMany() or insertOne() instead');
    });
  });
});
