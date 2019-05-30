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

  async getVehicle (vehicleID) {
    return this.db.get(vehicleID);
  }

  async createVehicle (record) {
    const resp = await this.db.post(record._doc);
    await record.setDoc(this.db.get(resp.id));
    return {ok: true, record};
  }

  async updateVehicle (VehicleInstance, delta) {
    const doc = VehicleInstance._doc;
    await this._emitter.db.put({...doc, ...delta, _rev: doc._rev});
    await VehicleInstance.setDoc(await this.db.get(doc._id));
    this.emit("updatedVehicle");
  }

  async deleteVehicle (vehicleID) {
    await this.db.remove(vehicleID);
  }
}

export default new VehicleDB();
