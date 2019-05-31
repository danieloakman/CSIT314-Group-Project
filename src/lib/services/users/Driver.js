const User = require("./User");

module.exports = class Driver extends User {
  constructor (userRecord) {
    super();

    // Attributes:
    this.type = "driver";
    this.description = "";
    this.vehicleIds = [];
    this.srId = null; // Service request ID currently assigned
    this.membership = false;
    this.membershipEndingDate = null;
    this.cardNo = "";
    this.cardExpiry = "";
    this.cardCSV = "";
    this.validCardDetails = false;
    this.serviceRequestIds = []; // List of completed service request ids.
    this.paymentIds = [];

    this.restoreAttributesFromUserRecord(userRecord);
  }
};
