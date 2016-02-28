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

class Cursor {
  constructor(collectionName, database) {
    this.collectionName = collectionName;
    this.database = database;
  }
}

module.exports = Cursor;
