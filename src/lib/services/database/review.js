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

  async getReviewsByDriver (driverID) {
    const response = await this.db.find({
      selector: {driverID: driverID},
      fields: ["_id"]
    }); // TODO: This will find ALL requests, not just active requests
    const reviews = response.docs;
    return reviews;
  }

  /**
   * Loads test data into database
   * @param {Object} opts
   * @param {Boolean} opts.loadSamples Should sampledata also be loaded (For volume testing)
   * @param {Boolean} opts.upsert Should existing documents be updated/replaced to match?
   */
  async _loadTestData (opts) {
    const testData = require("@assets/data/testReviews");
    const sampleData = require("@assets/data/sampleReviews");
    super._loadTestData(opts, {testData, sampleData});
  }
}

export default new ReviewDB();
