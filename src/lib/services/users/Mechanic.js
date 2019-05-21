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

    this.restoreAttributesFromUserRecord(userRecord);
  }

  /**
   * Verify that this mechanic is certified to work as a mechanic.
   * @param {String} documentationPath path to documentation
   */
  verify (documentationPath) {
    // todo: maybe create some logic here. Like send documentation to an admin or something
    if (documentationPath) this.verifiedMechanic = true;
  }
};
