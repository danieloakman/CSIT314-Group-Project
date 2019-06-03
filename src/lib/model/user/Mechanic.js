import User from "./User";
import UserDB from "@database/user";
import _ from "lodash";

/**
 * Mechanic class
 */
export default class Mechanic extends User {
  async init () {
    await super.init();
    this._doc.isVerified = false;
    this._doc.aggregateRating = 0; // Value between 0 and 10, where odd values are half-stars and even values are full stars. Can be decimal. (i.e. 7 = 3.5 stars and 8.4 = 4.2 stars)
    this._doc.activeOffer = null; // Service request ID currently assigned
    this._doc.offersSent = []; // List of service request IDs where this mechanic sent an offer
    this._doc.bsb = null;
    this._doc.bankAccountNo = null;
    this._doc.mechanicLicenceNo = null; // References their NSW motor vehicle repairer licence
    this._doc.awaitingVerification = false; // if true, this mechanic shows up in the list for verification by an admin
  }

  // TODO: offersSent should not be stored in the mechanic, but should be the result of a query on all offers

  /**
   * Adds an offer to the list of sent offers
   * @param {String} OfferID
   */
  async addOffer (OfferID) {
    const offersSent = this.offersSent;
    offersSent.push(OfferID);
    await this.setActiveOffer(OfferID);
    await UserDB.updateUser(this, {offersSent});
  }

  /**
   * Removes a given offer from the list of sent offers. Does not actually delete the offer
   * @param {String} OfferID
   */
  async removeOffer (OfferID) {
    const offersSent = this.offersSent;
    _.pull(offersSent, OfferID);
    await this.setActiveOffer(null);
    await UserDB.updateUser(this, {offersSent});
  }

  /**
   * Sets the active offer for the user. Can be set to null for no active offer
   * @param {String} OfferID
   */
  async setActiveOffer (OfferID) {
    await UserDB.updateUser(this, {activeOffer: OfferID});
  }

  async requestVerification (details = {bsb: null, bankAccountNo: null, mechanicLicenceNo: null}) {
    const delta = {
      isVerified: false,
      awaitingVerification: true,
      ...details
    };
    await UserDB.updateRecord(this, delta);
  }

  /**
   * Verify that this mechanic is certified to work as a mechanic.
   * @param {Boolean} [isDenied=false] If true, the mechanic verification request will be denied rather than verified
   */
  async verify (isDenied = false) {
    if (isDenied) {
      const delta = {
        isVerified: false,
        awaitingVerification: false,
      };
      await UserDB.updateRecord(this, delta);
      return null;
    }
    const delta = {
      isVerified: true,
      awaitingVerification: false,
    };
    await UserDB.updateRecord(this, delta);
  }

  get isVerified () { return this._doc.isVerified; }
  get aggregateRating () { return this._doc.aggregateRating; }
  get activeOffer () { return this._doc.activeOffer; }
  get offersSent () { return this._doc.offersSent; }
  get bsb () { return this._doc.bsb; }
  get bankAccountNo () { return this._doc.bankAccountNo; }
  get mechanicLicenceNo () { return this._doc.mechanicLicenceNo; }
  get awaitingVerification () { return this._doc.awaitingVerification; }
}
User.UserTypes["Mechanic"] = Mechanic;
