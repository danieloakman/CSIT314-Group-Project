const User = require("./User");

module.exports = class Mechanic extends User {
  constructor (userRecord) {
    super();

    // Attributes:
    this.jobs = [];

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
