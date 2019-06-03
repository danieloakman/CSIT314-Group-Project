import User from "./User";
import UserDB from "@database/user";
import Transaction from "@model/Transaction";
import _ from "lodash";

/**
 * Driver class
 */
export default class Driver extends User {
  async init () {
    await super.init();
    this._doc.description = "";
    this._doc.vehicles = [];
    this._doc.activeRequest = null;
    // this._doc.requestHistory = [];
    this._doc.isMember = false;
    this._doc.membershipEndingDate = null;
    this._doc.cardNo = "";
    this._doc.cardExpiry = 0;
    this._doc.cardCSV = "";
    this._doc.isCardValid = false;
  }

  /**
   * Adds a given vehicle to the driver profile
   * @param {String} vehicleID
   */
  async addVehicle (vehicleID) {
    const vehicles = this._doc.vehicles;
    vehicles.push(vehicleID);
    await UserDB.updateUser(this, {vehicles});
  }

  /**
   * Removes a given vehicle from the driver profile. Does not actually delete the vehicle
   * @param {String} vehicleID
   */
  async removeVehicle (vehicleID) {
    const vehicles = this._doc.vehicles;
    _.pull(vehicles, vehicleID);
    await UserDB.updateUser(this, {vehicles});
  }

  /**
   * Adds a given card to the user profile
   */
  async addCard (details = {cardNo: "", cardExpiry: new Date(), cardCSV: ""}) {
    const delta = {
      isCardValid: true,
      ...details,
      cardExpiry: details.cardExpiry.getTime()
    };
    await UserDB.updateUser(this, delta);
  }

  /**
   * Removes the card on the user profile
   */
  async removeCard () {
    const delta = {
      isCardValid: false,
      cardNo: "",
      cardExpiry: 0,
      cardCSV: ""
    };
    await UserDB.updateUser(this, delta);
  }

  /**
   * Adds membership to the user profile
   */
  async addMembership (details = {cardNo: "", cardExpiry: new Date(), cardCSV: ""}) {
    /*
      Create transaction
      fill with details about membership
      finalize transaction
      set as member
      set member expiry
    */
    const response = await Transaction.createTransaction("subscription", this.id);
    const newTransaction = response.record;
    // console.log(newTransaction);
    await newTransaction.setMulti(details);
    await newTransaction.finalize();
    const today = new Date();
    const expiry = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    return UserDB.updateRecord(this, {isMember: true, membershipEndingDate: expiry.getTime()});
  }

  get description () { return this._doc.description; }
  get vehicles () { return this._doc.vehicles; }
  get activeRequestID () { return this._doc.activeRequest; }
  get activeRequest () { return this._doc.activeRequest; }
  // get requestHistory () { return this._doc.requestHistory; }
  get isMember () { return this._doc.isMember; }
  get membershipEndingDate () { return new Date(this._doc.membershipEndingDate); }
  get isCardValid () { return this._doc.isCardValid; }
  get cardNo () { return this._doc.cardNo; }
  get cardExpiry () { return new Date(this._doc.cardExpiry); }
  get cardCSV () { return this._doc.cardCSV; }

  async setDescription (description) {
    await UserDB.updateUser(this, {description});
  }

  /**
   * Sets the active request for the user. Can be set to null for no active request
   * @param {String} requestID
   */
  async setActiveRequest (requestID = null) {
    await UserDB.updateUser(this, {activeRequest: requestID});
  }
}
User.UserTypes["Driver"] = Driver;
