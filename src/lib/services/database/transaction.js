import DBConnector from "./core";
const uuid = require("uuid/v4"); // random uuid

class PaymentDB extends DBConnector {
  constructor () {
    super("db.transactions");
    this.db.createIndex({index: {fields: ["type"]}});
    this.db.createIndex({index: {fields: ["payerID"]}}); // The person providing the dollarydoos
    this.db.createIndex({index: {fields: ["payeeID"]}}); // The person receiving the dolarydoos
    this.db.createIndex({index: {fields: ["amount"]}});
    this.db.createIndex({index: {fields: ["cardNo"]}});
    this.db.createIndex({index: {fields: ["cardExpiry"]}});
    this.db.createIndex({index: {fields: ["cardCSV"]}});
    this.db.createIndex({index: {fields: ["requestID"]}});
  }

  /**
   * dummy method to charge card. In a real system this would actually do something
   * @param {Number} amount
   * @param {String} cardNo
   * @param {String} cardExpiry
   * @param {String} cardCSV
   */
  async chargeCard (amount, cardNo, cardExpiry, cardCSV) {
    if (cardNo && amount && cardExpiry & cardCSV) { // todo: maybe return null if cardExpiry elapsed
      /**
       * --- PAYMENT CHARGED TO CARD HERE ---
       */
      return uuid(); // Return transaction id.
    } else return null;
  }

  /**
   * Loads test data into database
   * @param {Object} opts
   * @param {Boolean} opts.loadSamples Should sampledata also be loaded (For volume testing)
   * @param {Boolean} opts.upsert Should existing documents be updated/replaced to match?
   */
  async _loadTestData (opts) {
    const testData = require("@assets/data/testPayments");
    const sampleData = require("@assets/data/samplePayments");
    super._loadTestData(opts, {testData, sampleData});
  }
}

export default new PaymentDB();
