import DBConnector from "./core";

class OfferDB extends DBConnector {
  constructor () {
    super("db.offers");
    // this.db.createIndex({
    //   index: {
    //     fields: [
    //       "location",
    //       "location.coords",
    //       "location.coords.latitude",
    //       "location.coords.longitude",
    //     ],
    //   },
    // });
    this.db.createIndex({index: {fields: ["cost"]}});
    this.db.createIndex({index: {fields: ["mechanicID"]}});
    this.db.createIndex({index: {fields: ["status"]}}); // Don't know yet if this will be used
    this.db.createIndex({index: {fields: ["creationDate"]}});
  }
}

export default new OfferDB();
