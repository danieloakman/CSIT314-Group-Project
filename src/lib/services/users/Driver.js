const User = require("./User");

module.exports = class Driver extends User {
  constructor (userRecord) {
    super();

    // Attributes:
    this.type = "driver";
    this.description = "";
    this.vehicleIds = [];
    this.srId = null; // Service request ID currently assigned
    this.membership = null;
    this.balance = 0;
    this.serviceRequestHistory = [];

    this.restoreAttributesFromUserRecord(userRecord);
  }
};
