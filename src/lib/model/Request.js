import RequestDB from "@database/request";
import _ from "lodash";

import ModelWithDbConnection from "@model/ModelWithDbConnection";

import Offer from "./Offer";
import User from "./user";
// import Mechanic from "./user/Mechanic";
import Transaction from "./Transaction";

export default class Request extends ModelWithDbConnection {
  constructor (...args) {
    super(...args);
    this.db = RequestDB;
  }

  async init () {
    await super.init();
    this._doc.selectedOfferID = null;
    this._doc.offers = []; // List of offer ids on the request
    this._doc.status = "Awaiting offer acceptance";
    this._doc.completionDate = null;
    this._doc.transactionID = "";
  }

  static async getServiceRequest (RequestID) {
    const record = await RequestDB.getRecord(RequestID);
    if (record) { return new Request(record); }
    return null;
  }

  static getRequest = Request.getServiceRequest;

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

  async getOfferByMechanic (UserID) {
    return Offer.getFirstOfferByMechanic(this._doc.offers, UserID);
  }

  /**
   * Adds an offerID to the list of available offers
   * @param {String} OfferID
   */
  async submitOffer (OfferID) {
    const offers = this._doc.offers;
    offers.push(OfferID);
    // May need to add request to mechanic here
    const offer = await Offer.getOffer(OfferID);
    const mechanic = await User.getUser({id: offer.mechanicID});
    await mechanic.addOffer(OfferID);
    return RequestDB.updateRecord(this, {offers});
  }

  /**
   * Sets the offer as retracted
   */
  async retractOffer (OfferID) {
    const offer = await Offer.getOffer(OfferID);
    await this.setSelectedOfferID(null);
    await offer.setRetracted();
  }

  /**
   * Sets an offerID from the list as the accepted offer
   * @param {String} offerID
   */
  async acceptOffer (offerID) {
    await this.setSelectedOfferID(offerID);
    await this.setStatus("Offer accepted");
  }

  /**
   * Changes the accepted offer
   */
  async changeOffer () {}

  /**
   * Sets the service request as completed and performs any necessary processing, such as creating and paying transaction
   */
  async completeRequest () {
    const driver = await User.getUser({id: this.DriverID});
    const offer = await Offer.getOffer(this.selectedOfferID);
    const mechanic = await User.getUser({id: offer.mechanicID});
    let resp = await Transaction.createTransaction(driver.isMember ? "memberRequest" : "regularRequest", this.DriverID);

    if (!resp.ok) return resp;
    const newTransaction = resp.record;

    let transactionDetails = {
      requestID: this.id,
      offerID: this.selectedOfferID,
      payerID: this.DriverID,
      amount: offer.cost,
      payeeID: offer.mechanicID,
      payeeAccountNo: mechanic.bankAccountNo,
      payeeBSB: mechanic.bsb
    };
    if (!driver.isMember) {
      transactionDetails = {
        ...transactionDetails,
        cardNo: driver.cardNo,
        cardExpiry: driver.cardExpiry.getTime(),
        cardCSV: driver.cardCSV };
    }

    resp = newTransaction.setMulti(transactionDetails);
    if (!resp.ok) return resp;
    resp = await newTransaction.finalize();
    if (!resp.ok) return resp;

    const delta = {
      status: "Completed",
      transactionID: newTransaction.id,
      completionDate: Date.now()
    };
    await this.setMulti(delta);

    await driver.setActiveRequest();
    await mechanic.setActiveOffer();
  }

  get location () { return this._doc.location; }
  get driverID () { return this._doc.driverID; }
  get DriverID () { return this._doc.driverID; }
  get vehicleID () { return this._doc.vehicleID; }
  get VehicleID () { return this._doc.vehicleID; }
  get description () { return this._doc.description; }
  get selectedOfferID () { return this._doc.selectedOfferID; }
  get offers () { return this._doc.offers; }
  get status () { return this._doc.status; }
  get completionDate () { return new Date(this._doc.completionDate); }
  get isCompleted () { return this._doc.status === "Completed"; }
  get transactionID () { return this._doc.transactionID; }

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

  async setSelectedOfferID (selectedOfferID) {
    await RequestDB.updateRecord(this, {selectedOfferID});
  }

  async setOffers (offers) {
    await RequestDB.updateRecord(this, {offers});
  }

  async setStatus (status) {
    await RequestDB.updateRecord(this, {status});
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
