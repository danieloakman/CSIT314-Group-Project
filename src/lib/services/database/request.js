import DBConnector from "./core";
import LocationService from "@lib/services/LocationService";

class RequestDB extends DBConnector {
  constructor () {
    super("db.requests");
    this.db.createIndex({
      index: {
        fields: [
          "location",
          "location.coords",
          "location.coords.latitude",
          "location.coords.longitude",
        ],
      },
    });
    this.db.createIndex({index: {fields: ["driverID"]}});
    this.db.createIndex({index: {fields: ["vehicleID"]}});
    this.db.createIndex({index: {fields: ["description"]}});
    this.db.createIndex({index: {fields: ["selectedOfferID"]}});
    this.db.createIndex({index: {fields: ["offers"]}});
    this.db.createIndex({index: {fields: ["status"]}});
    this.db.createIndex({index: {fields: ["creationDate"]}});
    this.db.createIndex({index: {fields: ["completionDate"]}});
  }

  /**
   * Returns a sorted array of service requests (distance in ascending order)
   * that are within radius distance from location.coords.
   * @param {locationObject} location
   * @param {number} radius
   * @return {Object[]}
   */
  async findInRadius (location, radius) {
    // Get all active requests (Could be improved by querying a reduced area before processing radius, although then the coordinate boundary needs to be accounted for)
    const response = await this.db.find({
      selector: {completionDate: {$exists: true}}
    }); // TODO: This will find ALL requests, not just active requests
    const activeRequests = response.docs;
    // console.log(activeRequests);

    // Return an array of requests in specified radius
    if (!activeRequests) return [];
    return activeRequests.map(request => {
      const distance = LocationService.getDistanceBetween(location.coords, request.location.coords);

      return {distance, _id: request._id};
    })
      .filter(request => request.distance < radius)
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Loads test data into database
   * @param {Object} opts
   * @param {Boolean} opts.loadSamples Should sampledata also be loaded (For volume testing)
   * @param {Boolean} opts.upsert Should existing documents be updated/replaced to match?
   */
  async _loadTestData (opts) {
    const testData = require("@assets/data/testRequests");
    const sampleData = require("@assets/data/sampleRequests");
    super._loadTestData(opts, {testData, sampleData});
  }
}

export default new RequestDB();
