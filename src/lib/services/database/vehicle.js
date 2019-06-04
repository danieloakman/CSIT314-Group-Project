import DBConnector from "./core";

/**
  * @typedef {Object} DBResponse
  * @property {Boolean} ok Whether request was successful
  * @property {String} [reason] Reason for failure
  * @property {Object} [record] The record successfully created in db
  */

class VehicleDB extends DBConnector {
  constructor () {
    super("db.vehicles");
    this.init();
  }

  async init () {
    super.init();
    this.db.createIndex({index: {fields: ["make"]}});
    this.db.createIndex({index: {fields: ["model"]}});
    this.db.createIndex({index: {fields: ["year"]}});
    this.db.createIndex({index: {fields: ["plate"]}});
    this.db.createIndex({index: {fields: ["vin"]}});
    this.db.createIndex({index: {fields: ["make", "model", "year"]}});
  }

  /**
   * Loads test data into database
   * @param {Object} opts
   * @param {Boolean} opts.loadSamples Should sampledata also be loaded (For volume testing)
   * @param {Boolean} opts.upsert Should existing documents be updated/replaced to match?
   */
  async _loadTestData (opts) {
    const testData = require("@assets/data/testVehicles");
    const sampleData = require("@assets/data/sampleVehicles");
    super._loadTestData(opts, {testData, sampleData});
  }
}

export default new VehicleDB();
