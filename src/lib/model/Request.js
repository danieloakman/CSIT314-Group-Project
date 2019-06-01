import RequestDB from "@database/request";

import ModelWithDbConnection from "@model/ModelWithDbConnection";

export default class Request extends ModelWithDbConnection {
  async init () {
    this._doc.assignedMechanicID = null;
    this._doc.offers = [];
    this._doc.status = "Awaiting offer acceptance";
    this._doc.creationDate = Date.now();
    this._doc.completionDate = null;
  }

  static async getServiceRequest (RequestID) {
    return RequestDB.getRecord(RequestID);
  }

  getRequestsInRadius = RequestDB.findInRadius.bind(RequestDB);

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
    return RequestDB.createRecord(record);
  }

  static async deleteServiceRequest (RequestID) {
    return RequestDB.deleteRecord(RequestID);
  }

  get location () { return this._doc.location; }
  get DriverID () { return this._doc.DriverID; }
  get VehicleID () { return this._doc.VehicleID; }
  get description () { return this._doc.description; }
  get assignedMechanicID () { return this._doc.assignedMechanicID; }
  get Offers () { return this._doc.Offers; }
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

  async setAssignedMechanicID (assignedMechanicID) {
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
