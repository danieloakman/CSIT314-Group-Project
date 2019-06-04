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
    this.db.createIndex({index: {fields: ["requestID"]}});
    this.db.createIndex({index: {fields: ["isRetracted"]}});
  }

  /**
   * Returns the first offer by a given mechanic from a given list of offers
   * @param {String[]} offerIDs
   * @param {String} mechanicID
   */
  async getFirstOfferByMechanic (offerIDs = [], mechanicID) {
    const results = await this.db.find({selector: {
      mechanicID: mechanicID,
      _id: {$in: offerIDs}
    }});
    return results.docs[0];
  }
}

export default new OfferDB();
