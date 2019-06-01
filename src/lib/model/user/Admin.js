import User from "./User";

/**
 * Admin class
 */
export default class Admin extends User {
  async init () {
    this._doc.jobs = [];
  }

  async getVerifiedMechanics () {
    // Return mechanics verified by this admin
    return [];
  }

  get jobs () { return this._doc.jobs; }
}
User.UserTypes["Admin"] = Admin;
