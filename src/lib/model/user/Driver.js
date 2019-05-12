import User from "./User";

/**
 * Driver class
 */
export default class Driver extends User {
  get type () { return this._doc.type; }
  get description () { return this._doc.description; }
  get vehicles () { return this._doc.vehicles; }
  get activeRequest () { return this._doc.activeRequest; }
  get requestHistory () { return this._doc.requestHistory; }
  get isMember () { return this._doc.isMember; }
}
