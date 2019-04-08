const User = require("./User");

module.exports = class Driver extends User {
  constructor (userRecord) {
    super();

    // Attributes:
    this.vehicles = [];

    this.restoreAttributesFromUserRecord(userRecord);
  }

  addVehicle (regoPlate, make, model, insurer) {
    this.vehicles.push({ // maybe create a vehicle class.
      regoPlate: regoPlate,
      make: make,
      model: model,
      insurer: insurer
    });
  }
};
