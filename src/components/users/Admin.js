const User = require("./User");

module.exports = class Admin extends User {
  constructor (userRecord) {
    super();

    // Attributes:
    this.jobs = [];

    this.restoreAttributesFromUserRecord(userRecord);
  }

  isAdmin () { return true; }
};
