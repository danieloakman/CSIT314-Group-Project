import User from "./User";
import UserDB from "@database/user";
import _ from "lodash";

/**
 * Mechanic class
 */
export default class Mechanic extends User {
  async init () {
    this._doc.isVerified = false;
    this._doc.aggregateRating = 0; // Value between 0 and 10, where odd values are half-stars and even values are full stars. Can be decimal. (i.e. 7 = 3.5 stars and 8.4 = 4.2 stars)
    this._doc.activeRequest = null; // Service request ID currently assigned
    this._doc.offersSent = []; // List of service request IDs where this mechanic sent an offer
    this._doc.bsb = null;
    this._doc.bankAccountNo = null;
    this._doc.mechanicLicenceNo = null; // References their NSW motor vehicle repairer licence
    this._doc.awaitingVerification = false; // if true, this mechanic shows up in the list for verification by an admin
  }

  /**
   * Adds an offer to the list of sent offers
   * @param {String} requestID
   */
  async addRequest (requestID) {
    const offersSent = this.offersSent;
    offersSent.push(requestID);
    // TODO: Add reference to mechanic to offer
    await UserDB.updateUser(this, {offersSent});
  }

  /**
   * Removes a given offer from the list of sent offers. Does not actually delete the offer
   * @param {String} requestID
   */
  async removeRequest (requestID) {
    const offersSent = this.offersSent;
    _.pull(offersSent, requestID);
    // TODO: Remove reference to mechanic from offer
    await UserDB.updateUser(this, {offersSent});
  }

  /**
   * Sets the active request for the user. Can be set to null for no active request
   * @param {String} requestID
   */
  async setActiveRequest (requestID) {
    await UserDB.updateUser(this, {activeRequest: requestID});
  }

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
  get bsb () { return this._doc.bsb; }
  get bankAccountNo () { return this._doc.bankAccountNo; }
  get mechanicLicenceNo () { return this._doc.mechanicLicenceNo; }
  get awaitingVerification () { return this._doc.awaitingVerification; }
}
User.UserTypes.push(Mechanic);
