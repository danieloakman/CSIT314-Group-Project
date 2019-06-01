const User = require("./User");

module.exports = class Admin extends User {
  constructor (userRecord) {
    super();

    // Attributes:
    this.type = "admin";

    this.restoreAttributesFromUserRecord(userRecord);
  }
};
