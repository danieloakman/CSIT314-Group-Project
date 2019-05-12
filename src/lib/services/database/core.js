import PouchDB from "pouchdb-react-native";
import Find from "pouchdb-find";
import Emitter from "tiny-emitter";

PouchDB.plugin(Find);

class DBConnector {
  static DBs = [];
  constructor (name) {
    this.db = new PouchDB(name);
    this._emitter = new Emitter();
    this.on = this._emitter.on;
    this.once = this._emitter.once;
    this.off = this._emitter.off;
    this.emit = this._emitter.emit;
  }

  static async loadTestData (wipe) {
    // this.DBs.map((db) => { db._loadTestData(); });
    for (const db in this.DBs) {
      if (wipe) { await db.wipe(); }
      await db._loadTestData();
    }
  }
}

export default DBConnector;
