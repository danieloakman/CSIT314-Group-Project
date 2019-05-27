import PouchDB from "pouchdb-react-native";
import Find from "pouchdb-find";
import Emitter from "tiny-emitter";

PouchDB.plugin(Find);

class DBConnector {
  static DBs = [];
  constructor (name) {
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
}

export default DBConnector;
