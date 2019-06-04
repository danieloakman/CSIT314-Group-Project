import OfferDB from "@database/offer";

import ModelWithDbConnection from "@model/ModelWithDbConnection";

export default class Offer extends ModelWithDbConnection {
  constructor (...args) {
    super(...args);
    this.db = OfferDB;
  }

  async init () {
    this._doc.isRetracted = false;
  }
  static async getOffer (OfferID) {
    const record = await OfferDB.getRecord(OfferID);
    if (record) { return new Offer(record); }
    return null;
  }

  static async createOffer (requestID, mechanicID, cost) {
    const record = {
      requestID,
      mechanicID,
      cost,
    };

    const newOffer = new Offer(record);
    await newOffer.init();
    return OfferDB.createRecord(newOffer);
  }

  /**
   * Deletes an offer from db. Does not delete references to it.
   * @param {String} offerID
   */
  static async deleteOffer (offerID) {
    return OfferDB.deleteRecord(offerID);
  }

  static async getFirstOfferByMechanic (...args) {
    const result = await OfferDB.getFirstOfferByMechanic(...args);
    if (result) { return Offer.getOffer(result._id); }
    return null;
  }

  get cost () { return this._doc.cost; }
  get isRetracted () { return this._doc.isRetracted; }
  get mechanicID () { return this._doc.mechanicID; }
  get requestID () { return this._doc.requestID; }

  async setCost (cost) {
    await OfferDB.updateRecord(this, {cost});
  }

  async setRetracted () {
    await OfferDB.updateRecord(this, {isRetracted: true});
  }

  /**
   * Sets multiple values in the offer at once
   * @param {Object} delta The delta object containing changed values
   */
  async setMulti (delta) {
    await OfferDB.updateRecord(this, delta);
  }
}
