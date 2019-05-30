
/**
 * Base class for models that maintain a state from the database
 * Will handle things such as updating the internal doc, and other stuff
 * @abstract
 */
export default class ModelWithDbConnection {
  constructor (record) {
    // All data is stored in _doc following single source of truth principles
    this._doc = record;
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
