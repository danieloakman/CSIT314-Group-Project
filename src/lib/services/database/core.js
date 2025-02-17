import {EventEmitter} from "events";
import Fuse from "fuse.js";
import PouchDB from "./PouchDB";

// PouchDB.debug.enable("pouchdb:find");

/**
  * @typedef {Object} DBResponse
  * @property {Boolean} ok Whether request was successful
  * @property {String} [reason] Reason for failure
  * @property {Object} [record] The record successfully created in db
  * @property {String} [id] The id of the document
  * @property {String} [rev] The revision of the document
  */

class DBConnector extends EventEmitter {
  static DBs = []; // Collects each child class instance
  constructor (name = "db.core") {
    super();
    this.dbName = name; // Allow access to database name
    this.db = new PouchDB(name, {adapter: "react-native-sqlite", revs_limit: 20});
    DBConnector.DBs.push(this);
  }

  async init () {
    this.db.createIndex({index: {fields: ["creationDate"]}});
  }

  /**
   * Loads test data from files into databases
   * @param {Object} opts
   * @param {Boolean} opts.wipe Should database be wiped first?
   * @param {Boolean} opts.loadSamples Should sampledata also be loaded (For volume testing)
   * @param {Boolean} opts.upsert Should existing documents be updated/replaced to match?
   */
  static async loadTestData (opts = {wipe: false, loadSamples: false, upsert: false}) {
    if (opts.wipe) { await DBConnector.wipeAll(); }
    await Promise.all(DBConnector.DBs.map(db => db._loadTestData(opts)));
  }

  /**
   * Loads test data into database
   * @param {Object} opts
   * @param {Boolean} opts.loadSamples Should sampledata also be loaded (For volume testing)
   * @param {Boolean} opts.upsert Should existing documents be updated/replaced to match?
   * @param {Object} data The data to insert
   * @param {Object[]} data.testData
   * @param {Object[]} data.sampleData
   */
  async _loadTestData (opts, data) {
    if (!data) return;
    const {testData, sampleData} = data;
    const dbInfo = await this.db.info();
    if (dbInfo.doc_count <= 0) {
      await this.db.bulkDocs(testData);
      await this.db.bulkDocs(sampleData);
    } else {
      await Promise.all(testData.map((doc) => {
        if (opts.upsert) {
          return this.db.upsert(doc._id, doc);
        } else {
          return this.db.putIfNotExists(doc);
        }
      }));
    }
  }

  /**
   * Deletes all entries in this database
   */
  async wipe () {
    const oldRecords = await this.db.allDocs();
    await Promise.all(oldRecords.rows.map((doc) => {
      if (!doc.id.startsWith("_design/")) {
        return this.db.remove(doc.id, doc.value.rev);
      }
    }));
  }

  /**
   * Deletes all entries in all databases
   */
  static async wipeAll () {
    return Promise.all(this.DBs.map(db => db.wipe()));
  }

  /**
   * Searches database for items starting with a given term and returns an array of weightings and ids. Recommended to debounce for live update searches
   * @param {string} term The term to search for
   * @param {object[]} fields The fields in which to search, and optional weightings
   * @param {string} fields.name The name of the field to search
   * @param {number} [fields.weight] The field weightings for sorting
   * @param {boolean} [excludeType] Whether to exclude database name values in each result entry
   * @return {array}
   */
  async fuzzySearch (term, fields, excludeType = false) {
    /*
    Note: PouchDB is not a database optimized for partial term searches
    While it actually can do such a search, it will not use any indexes meaning slow performance. This implementation is an alternative, which may not match in all cases, but should use indexes for better performance.
    The goal is to perform searches across all data stored, while still maintaining sub-second search times.
    */
    let results = {};

    // Search across each field given
    for (const field of fields) {
      const match = await this.db.find({
        selector: {
          [field.name]: {$gte: term}
        }
      }).docs;
      // Create aggregated list of objects
      match.docs.map((doc) => {
        results[doc._id] = doc;
      });
    }

    const options = {
      keys: fields,
      id: "_id",
      includeScore: true,
      threshold: 0.6,
      distance: 100
    };

    // Perform fuzzy search to apply scores
    const fuse = new Fuse(results.values(), options);
    let result = await fuse.search(term);

    // Add dbName value to each entry as they may be merged into an array with entries from multiple dbs
    if (!excludeType) {
      result = result.map((item) => {
        item.dbName = this.dbName;
        return item;
      });
    }

    return result;
  }

  /**
   * Allows direct queries on database from higher levels.
   * Generally should not be used, but if extra control is
   * needed for a search, then its here
   */
  async find (...params) {
    return this.db.find(...params);
  }

  /**
   * Returns a record given its id
   * @param {String} recordID
   */
  async getRecord (recordID) {
    if (recordID) {
      try {
        return this.db.get(recordID);
      } catch (err) { return null; }
    }
  }

  /**
   * Creates a record in the database for the given object
   * @param {Object} record Object instance inheriting ModelWithDbConnection
   * @return {DBResponse}
   */
  async createRecord (record) {
    try {
      const resp = await this.db.post(record._doc);
      await record.setDoc(await this.db.get(resp.id));
      this.emit("createdRecord", resp.id);
      return {ok: true, record, ...resp};
    } catch (err) { return {ok: false, reason: err}; }
  }

  /**
   * Updates an existing record using the given delta object
   * @param {Object} RecordInstance
   * @param {Object} delta
   * @return {DBResponse}
   */
  async updateRecord (RecordInstance, delta) {
    try {
      const doc = RecordInstance._doc;
      // Updates should silently fail if the given record is frozen
      if (!Object.isFrozen(RecordInstance) && !Object.isFrozen(RecordInstance._doc)) {
        const resp = await this.db.put({...doc, ...delta, _rev: doc._rev});
        await RecordInstance.setDoc(await this.db.get(doc._id));
        this.emit("updatedRecord", doc._id);
        return {ok: true, ...resp};
      }
      return {ok: false, reason: "Attempting to update a frozen record"};
    } catch (err) { return {ok: false, reason: err}; }
  }

  /**
   * Deletes a record given its id
   * @param {String} recordID
   */
  async deleteRecord (recordID) {
    try {
      const record = this.db.get(recordID);
      const resp = await this.db.remove(record);
      this.emit("deletedRecord", recordID);
      return {ok: true, ...resp};
    } catch (err) { return {ok: false, reason: err}; }
  }
}

export default DBConnector;
