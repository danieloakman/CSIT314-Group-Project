import User from "./User";

/**
 * Admin class
 */
export default class Admin extends User {
  async init () {
    this._doc.jobs = [];
  }

  get jobs () { return this._doc.jobs; }
}
User.UserTypes.push(Admin);
