// Base class User
module.exports = class User {
  constructor () {
    this.type = "user";
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.phoneNo = "";
    this.registerDate = "";
    this.pictureURI = "";
    this.location = "";
    // add any more variables common to all classes derived from User
  }

  /**
   * All of the valid attributes in the provided userRecord are set to the attributes in the instance of this class.
   * Must be called last in a derived User class's constructor.
   */
  restoreAttributesFromUserRecord (userRecord) {
    for (const prop in userRecord) {
      if (this[prop] !== undefined) {
        this[prop] = userRecord[prop];
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Attribute "${prop}" is not declared in this User.`);
      }
    }
  }

  isAdmin () { return false; }
};
