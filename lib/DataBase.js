'use strict';

const debug = require('debug')('mongodb-client:database');
const MongoClient = require('mongodb');
const SDKBase = require('sdk-base');
const CollectionWrap = require('./CollectionWrap');

class DataBase extends SDKBase {
  constructor(url, options) {
    super();

    this.client = null;
    this._init(url, options);
  }

  /**
   * Get a collection
   *
   * @param {String} name - collection name
   * @return {Collection} The collection instance
   */
  collection(name) {
    return new CollectionWrap(this.client.collection(name));
  }

  // Alias collection
  c(name) {
    return this.collection(name);
  }

  admin() {
    return this.client.admin();
  }

  close() {
    return this.client.close();
  }

  _init(url, options) {
    const that = this;
    MongoClient.connect(url, options, function(err, client) {
      if (err) {
        debug('init(%j, %j) error: %s', url, options, err);
        that.emit('error', err);
        return;
      }
      debug('Connected correctly to server: %j', url);
      that.client = client;
      that.ready(true);
    });
  }
}

module.exports = DataBase;
