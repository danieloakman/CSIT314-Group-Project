const fs = require('fs');

// Base class User
module.exports = class User {
  constructor (firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    // add any more variables common to all classes derived from User
  }

  isAdmin () { return false; }

  /**
   * Save this user to the database.
   */
  saveUser () {
    // ATM just writes user to test file.
    try {
      let allUsers = require('../../assets/test-files/users');
      if (allUsers[this.email] !== undefined) throw new Error('A user with this email already exists.');
      else allUsers[this.email] = {constructor: this.constructor.name, account: this};
      fs.writeFileSync('./assets/test-files/users.json', JSON.stringify(allUsers, null, 2), {flag: 'w'});
      return {pass: true};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
      return err;
    }
  }
};
