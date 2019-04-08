// Base class User
module.exports = class User {
  constructor () {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.phoneNo = "";
    // add any more variables common to all classes derived from User
  }

  /**
   * All of the valid attributes in the provided userRecord are set to the attributes in the instance of this class.
   * Must be called last in a derived User class's constructor.
   */
  restoreAttributesFromUserRecord (userRecord) {
    for (let key of Object.keys(userRecord)) {
      if (this[key] !== undefined) {
        this[key] = userRecord[key];
      // eslint-disable-next-line no-console
      } else console.warn(`Attribute "${key}" is not declared in this User.`);
    }
  }

  isAdmin () { return false; }
};
