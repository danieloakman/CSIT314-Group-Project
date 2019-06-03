import OfferDB from "@database/offer";

import ModelWithDbConnection from "@model/ModelWithDbConnection";

export default class Offer extends ModelWithDbConnection {
  static async getOffer (OfferID) {
    const record = await OfferDB.getRecord(OfferID);
    if (record) { return new Offer(record); }
    return null;
  }

  static async createOffer (mechanicID, cost) {
    const record = {
      creationDate: Date.now(),
      mechanicID,
      cost
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

  get creationDate () { return new Date(this._doc.creationDate); }
  get cost () { return this._doc.cost; }
  get mechanicID () { return this._doc.mechanicID; }

  async setCost (cost) {
    await OfferDB.updateRecord(this, {cost});
  }

  /**
   * Sets multiple values in the offer at once
   * @param {Object} delta The delta object containing changed values
   */
  async setMulti (delta) {
    await OfferDB.updateRecord(this, delta);
  }
}
