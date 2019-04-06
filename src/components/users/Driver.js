const User = require('./User');

module.exports = class Driver extends User {
  constructor (firstName, lastName, email, password) {
    super(firstName, lastName, email, password);
    this.vehicles = []; // owned vehicles
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
