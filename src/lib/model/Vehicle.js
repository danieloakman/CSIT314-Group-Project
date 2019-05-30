import ModelWithDbConnection from "@model/ModelWithDbConnection";
import VehicleDB from "@database/vehicle";
import UserDB from "@database/user";
import _ from "lodash";

export default class Vehicle extends ModelWithDbConnection {
  async init () {
    this._doc.imageURI = "";
  }

  static async getVehicle (identifier) {
    const record = await VehicleDB.getVehicle(identifier);
    if (record) { return new Vehicle(record); }
    return null;
  }

  static async createVehicle ({make, model, year, plate, vin}) {
    const record = {
      make, model, year, plate, vin
    };
    const newVehicle = new Vehicle(record);
    await newVehicle.init();
    return VehicleDB.createVehicle(newVehicle);
  }

  static async deleteVehicle (vehicleID) {
    // Remove vehicle from each owner
    const owners = await UserDB.getUsersWithVehicle(vehicleID);
    await Promise.all(owners.map((id) => { UserDB.getUser({id}).removeVehicle(vehicleID); }));

    // Delete the vehicle
    await VehicleDB.deleteVehicle(vehicleID);
  }

  get make () { return this._doc.make; }
  get model () { return this._doc.model; }
  get year () { return this._doc.year; }
  get plate () { return this._doc.plate; }
  get vin () { return this._doc.vin; }
  get owners () { return this._doc.owners; }
  get imageURI () { return this._doc.imageURI; }

  async setMake (make) {
    await VehicleDB.updateVehicle(this, {make});
  }

  async setModel (model) {
    await VehicleDB.updateVehicle(this, {model});
  }

  async setYear (year) {
    await VehicleDB.updateVehicle(this, {year});
  }

  async setPlate (plate) {
    await VehicleDB.updateVehicle(this, {plate});
  }

  async setVin (vin) {
    await VehicleDB.updateVehicle(this, {vin});
  }

  async setImageURI (imageURI) {
    await VehicleDB.updateVehicle(this, {imageURI});
  }

  /**
   * Sets multiple values in the vehicle at once
   * @param {Object} delta The delta object containing changed values
   */
  async setMulti (delta) {
    await VehicleDB.updateVehicle(this, delta);
  }
}
