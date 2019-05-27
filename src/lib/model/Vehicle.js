import ModelWithDbConnection from "@model/ModelWithDbConnection";
import VehicleDB from "@database/vehicle";

export default class Vehicle extends ModelWithDbConnection {
  async init () {
    this._doc.owners = [];
    this._doc.imageURI = "";
  }

  static getVehicle (identifier) {
    const record = VehicleDB.getVehicle(identifier);
    if (record) { return new Vehicle(record); }
    return null;
  }

  static async createVehicle ({make, model, year, plate, vin}) {
    const record = {
      make, model, year, plate, vin
    };
    const newVehicle = new Vehicle(record);
    newVehicle.init();
    return VehicleDB.createVehicle(newVehicle);
  }

  static async deleteVehicle (identifier) {
    // TODO: Go through users who own car and delete
    VehicleDB.deleteVehicle(identifier);
  }
}
