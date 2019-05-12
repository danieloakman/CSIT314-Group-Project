import User from "./User";

/**
 * Mechanic class
 */
export default class Mechanic extends User {
  /**
   * Verify that this mechanic is certified to work as a mechanic.
   * @param {String} documentationPath path to documentation
   */
  verify (documentationPath) {
    // todo: maybe create some logic here. Like send documentation to an admin or something
    if (documentationPath) this.verifiedMechanic = true;
  }

  get isVerified () { return this._doc.isVerified; }
  get aggregateRating () { return this._doc.aggregateRating; }
  get activeRequest () { return this._doc.activeRequest; }
  get offersSent () { return this._doc.offersSent; }
}
