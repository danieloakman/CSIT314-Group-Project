import ModelWithDbConnection from "@model/ModelWithDbConnection";
import VehicleDB from "@database/vehicle";
import UserDB from "@database/user";
import _ from "lodash";

export default class Vehicle extends ModelWithDbConnection {
  async init () {
    await super.init();
    this._doc.imageURI = "";
  }

  static async getVehicle (identifier) {
    const record = await VehicleDB.getRecord(identifier);
    if (record) { return new Vehicle(record); }
    return null;
  }

  static async createVehicle ({make, model, year, plate, vin}) {
    const record = {
      make, model, year, plate, vin
    };
    const newVehicle = new Vehicle(record);
    await newVehicle.init();
    return VehicleDB.createRecord(newVehicle);
  }

  static async deleteVehicle (vehicleID) { // TODO: This won't work because removeVehicle is on an instantiated record, not on the document from db
    // Remove vehicle from each owner
    const owners = await UserDB.getUsersWithVehicle(vehicleID);
    await Promise.all(owners.map((id) => { UserDB.getUser({id}).removeVehicle(vehicleID); }));

    // Delete the vehicle
    return VehicleDB.deleteRecord(vehicleID);
  }

  get make () { return this._doc.make; }
  get model () { return this._doc.model; }
  get year () { return this._doc.year; }
  get plate () { return this._doc.plate; }
  get vin () { return this._doc.vin; }
  get owners () { return this._doc.owners; }
  get imageURI () { return this._doc.imageURI; }

  async setMake (make) {
    await VehicleDB.updateRecord(this, {make});
  }

  async setModel (model) {
    await VehicleDB.updateRecord(this, {model});
  }

  async setYear (year) {
    await VehicleDB.updateRecord(this, {year});
  }

  async setPlate (plate) {
    await VehicleDB.updateRecord(this, {plate});
  }

  async setVin (vin) {
    await VehicleDB.updateRecord(this, {vin});
  }

  async setImageURI (imageURI) {
    await VehicleDB.updateRecord(this, {imageURI});
  }

  /**
   * Sets multiple values in the vehicle at once
   * @param {Object} delta The delta object containing changed values
   */
  async setMulti (delta) {
    await VehicleDB.updateRecord(this, delta);
  }
}
