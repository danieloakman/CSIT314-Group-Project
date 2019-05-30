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

  // getVehicle = this.getRecord.bind(this);
  // createVehicle = this.createRecord.bind(this);
  // updateVehicle = this.updateRecord.bind(this);
  // deleteVehicle = this.deleteRecord.bind(this);
}

export default new VehicleDB();
