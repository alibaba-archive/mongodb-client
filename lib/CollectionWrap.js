'use strict';

const deprecate = require('depd')('mongodb-client:CollectionWrap');

class CollectionWrap {
  constructor(collection) {
    this.collection = collection;
  }

  // public methods

  /**
   * Inserts a document into a collection.
   *
   * Usage:
   *
   * ```js
   * const result = yield db.collection('user').insertOne({
   *   name: 'fengmk2',
   * });
   * ```
   * @see https://docs.mongodb.org/manual/reference/method/db.collection.insertOne/#db.collection.insertOne
   * @param {Document} document - A document to insert into the collection.
   * @param {Object} [options=null] - Optional settings.
   * @param {WriteConcern} [options.writeConcern=null] - A document expressing the write concern.
   *   Omit to use the default write concern.
   * @return {InsertResult} An object that contains the status of the operation.
   */

  * insertOne(document, options) {
    options = this._formatInsertOptions(options);
    return yield this.collection.insertOne(document, options);
  }

  /**
   * Inserts documents into a collection.
   *
   * Usage:
   *
   * ```js
   * const result = yield db.collection('user').insertMany([
   *   {
   *     name: 'fengmk2',
   *     age: 18,
   *   },
   *   {
   *     name: 'dead-horse',
   *     age: 16,
   *   },
   * ]);
   * ```
   *
   * @see https://docs.mongodb.org/manual/reference/method/db.collection.insert/#db.collection.insert
   * @param {Document[]} documents - A document or array of documents to insert into the collection.
   * @param {Document} [options=null] - Optional settings.
   * @param {WriteConcern} [options.writeConcern=null] - A document expressing the write concern.
   * Omit to use the default write concern.
   * See https://docs.mongodb.org/manual/reference/method/db.collection.insert/#insert-wc
   * @param {Boolean} [options.ordered=true] - If true, perform an ordered insert of the documents in the array,
   * and if an error occurs with one of documents,
   * MongoDB will return without processing the remaining documents in the array.
   * If false, perform an unordered insert, and if an error occurs with one of documents,
   * continue processing the remaining documents in the array.
   * @return {InsertManyResult} An object for bulk inserts that contains the status of the operation.
   */

  * insertMany(documents, options) {
    options = this._formatInsertOptions(options);
    const result = yield this.collection.insertMany(documents, options);
    return this._formatInsertManyResult(result);
  }

  * insert() {
    throw new TypeError('insert() method was removed, please use insertMany() or insertOne() instead');
  }

  /**
   * @typedef {Object} WriteConcern
   * Write concern describes the level of acknowledgement requested from MongoDB
   * for write operations to a standalone mongod or to replica sets or to sharded clusters.
   * In sharded clusters, mongos instances will pass the write concern on to the shards.
   *
   * @property {Number|String} [w=1] - Requests acknowledgement that the write operation has propagated
   * to the specified number of mongod instances. For example:
   * - `w: 1` Requests acknowledgement that the write operation has propagated to
   * 		the standalone mongod or the primary in a replica set.
   * - `w: 0` Requests no acknowledgment of the write operation.
   * 		However, `w: 0` may return information about socket exceptions and networking errors to the application.
   * 		If you specify `w: 0` but include `j: true`, the `j: true` prevails to
   * 		request acknowledgement from the standalone mongod or the primary of a replica set.
   *
   * Numbers greater than 1 are valid only for replica sets to request acknowledgement from specified number of members,
   * including the primary.
   * @property {Boolean} [j=true] - The j option requests acknowledgement from MongoDB
   * that the write operation has been written to the journal.
   * @property {Number} [wtimeout=null] - This option specifies a time limit, in milliseconds, for the write concern.
   * wtimeout is only applicable for `w` values greater than 1.
   */

  /**
   * @typedef {Object} InsertManyResult
   * An object that contains the results of the insertMany() method.
   *
   * @property {Number} insertedCount - The total amount of documents inserted.
   * @property {Document[]} ops - All the documents inserted, each document contain the _id field.
   * @property {ObjectId[]} insertedIds - All the generated _id's for the inserted documents.
   * @property {Object} result - The raw command result object returned from MongoDB (content might vary by server version).
   * @property {Number} result.ok - Is 1 if the command executed correctly.
   * @property {Number} result.n - The total count of documents inserted.
   */

  // private methods

  _formatInsertOptions(options) {
    if (options) {
      if (options.forceServerObjectId) {
        options.forceServerObjectId = false;
        deprecate('options.forceServerObjectId was disabled and won\'t be effect, please forget it');
      }
      if (options.writeConcern) {
        for (const key in options.writeConcern) {
          options[key] = options.writeConcern[key];
        }
      }
    }
    return options;
  }

  _formatInsertManyResult(result) {
    if (result.insertedIds.length > 0) {
      if (Array.isArray(result.insertedIds[0])) {
        // insertedIds:
        //  [ [ '0', '1' ],
        //    56d305b8f051150fd17badac,
        //    56d305b8f051150fd17badad ]
        //
        // correct the error format to
        //
        // insertedIds: [ 56d305b8f051150fd17badac, 56d305b8f051150fd17badad ]
        result.insertedIds = result.insertedIds.slice(1);
      } else if (result.insertedIds[0] === undefined) {
        // [ , 5889703f02568ad2c27f794d, 5889703f02568ad2c27f794e ]
        result.insertedIds = result.insertedIds.slice(1);
      }
    }
    return result;
  }
}

module.exports = CollectionWrap;
