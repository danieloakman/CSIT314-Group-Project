import DBConnector from "./core";

class ReviewDB extends DBConnector {
  constructor () {
    super("db.reviews");
    this.db.createIndex({index: {fields: ["value"]}});
    this.db.createIndex({index: {fields: ["comment"]}});
    this.db.createIndex({index: {fields: ["requestID"]}});
    this.db.createIndex({index: {fields: ["driverID"]}});
    this.db.createIndex({index: {fields: ["mechanicID"]}});
  }
}

export default new ReviewDB();
