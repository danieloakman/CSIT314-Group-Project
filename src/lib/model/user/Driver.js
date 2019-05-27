import User from "./User";

/**
 * Driver class
 */
export default class Driver extends User {
  async init () {
    this._doc.description = "";
    this._doc.vehicles = [];
    this._doc.activeRequest = null;
    this._doc.requestHistory = [];
    this._doc.isMember = false;
  }

  get description () { return this._doc.description; }
  get vehicles () { return this._doc.vehicles; }
  get activeRequest () { return this._doc.activeRequest; }
  get requestHistory () { return this._doc.requestHistory; }
  get isMember () { return this._doc.isMember; }
}
User.UserTypes.push(Driver);
