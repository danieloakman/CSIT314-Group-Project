import DBConnector from "@database/core";
/**
 * Base class for models that maintain a state from the database
 * Will handle things such as updating the internal doc, and other stuff
 * @abstract
 */
export default class ModelWithDbConnection {
  constructor (record) {
    // This should always be overridden by child
    this.db = new DBConnector();
    // All data is stored in _doc following single source of truth principles
    this._doc = record;
    this.db.once("updatedRecord", this.updateListener.bind(this));
  }

  // TODO: Automatically update the internal doc when the database value changes

  /**
   * Initialises the data in the record.
   * Used instead of constructor as it should only be used when a record is being created, not when being restored from db, also allows async to be used.
   */
  async init () {}

  /**
   * Update document if it changes in DB (UNTESTED!)
   * @param {String} id The ID that's changed
   */
  async updateListener (id) {
    /*
      Register listener for single call
      On update of document, update this._doc
    */
    if (this instanceof DBConnector) {
      // A once listener is used so that if the object is deleted, it will only attempt to be updated once
      this.db.once("updatedRecord", this.updateListener.bind(this));
      if (this.id === id) { await this.setDoc(await this.db.getRecord(id)); }
    }
  }

  /**
   * Set doc to new document. Should only be used by db backend.
   * @param {Object} document
   */
  async setDoc (document) {
    this._doc = document;
  }

  get id () { return this._doc._id; }
}
