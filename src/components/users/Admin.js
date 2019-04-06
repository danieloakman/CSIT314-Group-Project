const User = require('./User');

module.exports = class Admin extends User {
  constructor (firstName, lastName, email, password) {
    super(firstName, lastName, email, password);
    this.jobs = []; // assigned jobs. Just a placeholder
  }

  isAdmin () { return true; }
};
