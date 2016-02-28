/**
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

/**
 * A wrapper that contains the result status of the mongo write methods.
 *
 * @class WriteResult
 */

/**
 * The number of documents inserted, excluding upserted documents.
 * See {WriteResult#nUpserted} for the number of documents inserted through an upsert.
 * @member WriteResult#nInserted
 */

/**
 * The number of documents selected for update.
 * If the update operation results in no change to the document,
 * e.g. `$set` expression updates the value to the current value,
 * {WriteResult#nMatched} can be greater than {WriteResult#nModified}.
 * @member WriteResult#nMatched
 */
