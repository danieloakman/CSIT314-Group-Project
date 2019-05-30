import PouchDB from "pouchdb-react-native";
import Find from "pouchdb-find";
import Emitter from "tiny-emitter";
import Fuse from "fuse.js";

PouchDB.plugin(Find);

class DBConnector {
  static DBs = [];
  constructor (name) {
    this.dbName = name; // Allow access to database name
    this.db = new PouchDB(name);
    DBConnector.DBs.push(this.db);

    // TODO: Move emitter to mixin
    this._emitter = new Emitter();
    this.on = this._emitter.on;
    this.once = this._emitter.once;
    this.off = this._emitter.off;
    this.emit = this._emitter.emit;
  }

  static async loadTestData (wipe) {
    // this.DBs.map((db) => { db._loadTestData(); });
    if (wipe) { await this.wipeAll(); }
    for (const db in this.DBs) {
      await db._loadTestData();
    }
  }

  /**
   * Deletes all entries in this database
   */
  async wipe () {
    await this.db.destroy();
  }

  /**
   * Deletes all entries in all databases
   */
  static async wipeAll () {
    for (const db in this.DBs) {
      await db.wipe();
    }
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
   * Returns a record given its id
   * @param {String} recordID
   */
  async getRecord (recordID) {
    return this.db.get(recordID);
  }

  /**
   * Creates a record in the database for the given object
   * @param {Object} record Object instance inheriting ModelWithDbConnection
   */
  async createRecord (record) {
    const resp = await this.db.post(record._doc);
    await record.setDoc(this.db.get(resp.id));
    return {ok: true, record};
  }

  /**
   * Updates an existing record using the given delta object
   * @param {Object} RecordInstance
   * @param {Object} delta
   */
  async updateRecord (RecordInstance, delta) {
    const doc = RecordInstance._doc;
    await this._emitter.db.put({...doc, ...delta, _rev: doc._rev});
    await RecordInstance.setDoc(await this.db.get(doc._id));
    this.emit("updatedRecord");
  }

  async deleteRecord (recordID) {
    await this.db.remove(recordID);
  }
}

export default DBConnector;
