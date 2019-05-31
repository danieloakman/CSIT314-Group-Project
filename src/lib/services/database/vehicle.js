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
    this.db.createIndex({index: {fields: ["make", "model", "year", "plate", "vin"]}});
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

  // getVehicle = this.getRecord.bind(this);
  // createVehicle = this.createRecord.bind(this);
  // updateVehicle = this.updateRecord.bind(this);
  // deleteVehicle = this.deleteRecord.bind(this);
}

export default new VehicleDB();
