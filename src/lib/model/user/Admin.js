import User from "./User";
import UserDB from "@database/user";

/**
 * Admin class
 */
export default class Admin extends User {
  async init () {
    await super.init();
    this._doc.jobs = [];
  }

  async getVerifiedMechanics () {
    // Return mechanics verified by this admin
    const mechanics = await UserDB.getVerifiedMechanicsByVerifier(this.id);
    return Promise.all(mechanics.map((entry) => {
      return User.getUser({id: entry._id});
    }));
  }

  get jobs () { return this._doc.jobs; }
}
User.UserTypes["Admin"] = Admin;
