import RequestDB from "@database/request";
import _ from "lodash";

import ModelWithDbConnection from "@model/ModelWithDbConnection";

import Offer from "./Offer";

export default class Request extends ModelWithDbConnection {
  async init () {
    await super.init();
    this._doc.selectedOfferID = null;
    this._doc.offers = []; // List of offer ids on the request
    this._doc.status = "Awaiting offer acceptance";
    this._doc.creationDate = Date.now();
    this._doc.completionDate = null;
  }

  static async getServiceRequest (RequestID) {
    const record = await RequestDB.getRecord(RequestID);
    if (record) { return new Request(record); }
    return null;
  }

  // static getRequestsInRadius = RequestDB.findInRadius.bind(RequestDB);
  static async getRequestsInRadius (...args) {
    const requests  = await RequestDB.findInRadius(...args);
    return Promise.all(requests.map(async (entry) => {
      return Request.getServiceRequest(entry._id);
    }));
  }

  /**
   * Creates a service request.
   * The checks to see if the driver and vehicle don't
   * already have an srId should be done before calling this function.
   * @param {Object} location
   * @param {string} driverEmail
   * @param {string} vehicleId
   * @param {string} description
   */
  static async createServiceRequest (location, driverID, vehicleID, description) {
    const record = {location, driverID, vehicleID, description};
    const newRequest = new Request(record);
    await newRequest.init();
    return RequestDB.createRecord(newRequest);
  }

  static async deleteServiceRequest (RequestID) {
    return RequestDB.deleteRecord(RequestID);
  }

  /**
   * Adds an offerID to the list of available offers
   * @param {String} OfferID
   */
  async submitOffer (OfferID) {
    const offers = this._doc.offers;
    offers.push(OfferID);
    // May need to add request to mechanic here
    return RequestDB.updateRecord(this, {offers});
  }

  /**
   * Removes an offerID from the list of available offers
   * Also resets acceptedOffer if it referenced the removed offer.
   * Finally sets the status to offer retracted
   */
  async retractOffer (OfferID) {
    // pull offer
    // delete offer
    // update db
    const offers = this._doc.offers;
    _.pull(OfferID);
    Offer.deleteOffer(OfferID);
    return RequestDB.updateRecord(this, {offers, selectedOfferID: null});
  }

  /**
   * Sets an offerID from the list as the accepted offer
   */
  async acceptOffer () {}

  /**
   * Changes the accepted offer
   */
  async changeOffer () {}

  /**
   * Sets the service request as completed then creates new transaction
   * Also purges system of other offers
   */
  async completeRequest () {}

  get location () { return this._doc.location; }
  get DriverID () { return this._doc.DriverID; }
  get VehicleID () { return this._doc.VehicleID; }
  get description () { return this._doc.description; }
  get selectedOfferID () { return this._doc.selectedOfferID; }
  get Offers () { return this._doc.offers; }
  get status () { return this._doc.status; }
  get creationDate () { return new Date(this._doc.creationDate); } // Constructed date objects cannot be stored as is
  get completionDate () { return new Date(this._doc.completionDate); }

  async setLocation (location) {
    await RequestDB.updateRecord(this, {location});
  }

  async setDriverID (driverID) {
    await RequestDB.updateRecord(this, {driverID});
  }

  async setVehicleID (vehicleID) {
    await RequestDB.updateRecord(this, {vehicleID});
  }

  async setDescription (description) {
    await RequestDB.updateRecord(this, {description});
  }

  async setSelectedOfferID (assignedMechanicID) {
    await RequestDB.updateRecord(this, {assignedMechanicID});
  }

  async setOffers (offers) {
    await RequestDB.updateRecord(this, {offers});
  }

  async setStatus (status) {
    await RequestDB.updateRecord(this, {status});
  }

  /**
   *
   * @param {Date} creationDate
   */
  async setCreationDate (creationDate) {
    if (creationDate.constructor === Date) {
      const date = creationDate.getTime();
      await RequestDB.updateRecord(this, {date});
    }
  }

  /**
   *
   * @param {Date} completionDate
   */
  async setCompletionDate (completionDate) {
    if (completionDate.constructor === Date) {
      const date = completionDate.getTime();
      await RequestDB.updateRecord(this, {date});
    }
  }

  /**
   * Sets multiple values in the request at once
   * @param {Object} delta The delta object containing changed values
   */
  async setMulti (delta) {
    await RequestDB.updateRecord(this, delta);
  }
}
