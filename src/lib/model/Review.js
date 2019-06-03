import ReviewDB from "@database/review";
import _ from "lodash";

import ModelWithDbConnection from "@model/ModelWithDbConnection";

export default class Review extends ModelWithDbConnection {
  constructor (...args) {
    super(...args);
    this.db = ReviewDB;
  }

  async init () {
    await super.init();
  }

  static async getReview (ReviewID) {
    const record = await ReviewDB.getRecord(ReviewID);
    if (record) { return new Review(record); }
    return null;
  }

  static async createReview (details = {value: 0, comment: "", requestID: null, driverID: null, mechanicID: null}) {
    const newReview = new Review(details);
    await newReview.init();
    return ReviewDB.createRecord(newReview);
  }

  get value () { return this._doc.value; }
  get comment () { return this._doc.comment; }
  get requestID () { return this._doc.requestID; }
  get driverID () { return this._doc.driverID; }
  get mechanicID () { return this._doc.mechanicID; }

  /**
   * Sets multiple values in the review at once
   * @param {Object} delta The delta object containing changed values
   */
  async setMulti (delta) {
    await ReviewDB.updateRecord(this, delta);
  }
}
