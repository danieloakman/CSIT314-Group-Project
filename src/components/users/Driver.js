const User = require("./User");

module.exports = class Driver extends User {
  constructor (userRecord) {
    super();

    // Attributes:
    this.type = "driver";
    this.description = "";
    this.vehicles = [];

    this.restoreAttributesFromUserRecord(userRecord);
  }

  // TODO: Vehicles need to be stored separately in database, as they may be shared between multiple users
  addVehicle (regoPlate, make, model, insurer) {
    this.vehicles.push({ // maybe create a vehicle class.
      regoPlate: regoPlate,
      make: make,
      model: model,
      insurer: insurer
    });
  }
};
