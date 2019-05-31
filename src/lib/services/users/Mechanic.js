const User = require("./User");

module.exports = class Mechanic extends User {
  constructor (userRecord) {
    super();

    // Attributes:
    this.type = "mechanic";
    this.verifiedMechanic = false;
    this.rating = "Un-rated";
    this.srId = null; // Service request ID currently assigned
    this.offersSent = []; // List of service request IDs where this mechanic sent an offer
    this.bsb = null;
    this.bankAccountNo = null;
    this.mechanicLicenceNo = null; // References their NSW motor vehicle repairer licence
    this.awaitingVerification = false; // If true, this mechanic shows up in the list for verification by an admin
    this.serviceRequestIds = []; // List of completed service request ids.
    this.earnings = 0;

    this.restoreAttributesFromUserRecord(userRecord);
  }
};
