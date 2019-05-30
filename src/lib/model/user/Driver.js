import User from "./User";
import UserDB from "@database/user";
import _ from "lodash";

/**
 * Driver class
 */
export default class Driver extends User {
  async init () {
    this._doc.description = "";
    this._doc.vehicles = [];
    this._doc.activeRequest = null;
    // this._doc.requestHistory = [];
    this._doc.isMember = false;
  }

  async setDescription (description) {
    await UserDB.updateUser(this, {description});
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

  // Details about a request, such as who made it, should be stored in the request only
  // /**
  //  * Adds a given request to the driver profile
  //  * @param {String} requestID
  //  */
  // async addRequest (requestID) {
  //   const requestHistory = this._doc.requestHistory;
  //   requestHistory.push(requestID);
  //   // TODO: add reference to driver to request
  //   await UserDB.updateUser(this, {requestHistory});
  // }

  // /**
  //  * Removes a given request from the driver profile. Does not actually delete the request
  //  * @param {String} requestID
  //  */
  // async removeRequest (requestID) {
  //   const requestHistory = this._doc.requestHistory;
  //   _.pull(requestHistory, requestID);
  //   // TODO: remove reference to driver from request
  //   await UserDB.updateUser(this, {requestHistory});
  // }

  /**
   * Sets the active request for the user. Can be set to null for no active request
   * @param {String} requestID
   */
  async setActiveRequest (requestID) {
    await UserDB.updateUser(this, {activeRequest: requestID});
  }

  get description () { return this._doc.description; }
  get vehicles () { return this._doc.vehicles; }
  get activeRequest () { return this._doc.activeRequest; }
  get requestHistory () { return this._doc.requestHistory; }
  get isMember () { return this._doc.isMember; }
}
User.UserTypes.push(Driver);
