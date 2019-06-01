import PouchDB from "pouchdb-core";
import mapreduce from "pouchdb-mapreduce";
import Find from "pouchdb-find";
import Upsert from "pouchdb-upsert";

import {SQLite} from "expo";
import SQLiteAdapterFactory from "pouchdb-adapter-react-native-sqlite";

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);

export default PouchDB
  .plugin(SQLiteAdapter)
  .plugin(mapreduce)
  .plugin(Find)
  .plugin(Upsert);
