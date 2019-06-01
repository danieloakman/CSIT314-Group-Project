import DBConnector from "./core";
import {AsyncStorage} from "react-native";

/**
  * @typedef {Object} DBResponse
  * @property {Boolean} ok Whether request was successful
  * @property {String} [reason] Reason for failure
  * @property {Object} [record] The record successfully created in db
  */

class UserDB extends DBConnector {
  constructor () {
    super("db.users");

    // Each fields that needs to be accessed individually should be its own index
    // If there are multiple fields that are frequently accessed in the same query, then they should be indexed together (in the same order as query)

    // User index
    this.db.createIndex({index: {fields: ["type"]}});
    this.db.createIndex({index: {fields: ["email"]}});
    this.db.createIndex({index: {fields: ["fname"]}});
    this.db.createIndex({index: {fields: ["lname"]}});
    this.db.createIndex({index: {fields: ["phoneNo"]}});
    this.db.createIndex({index: {fields: ["fname", "lname"]}});

    // Driver index
    this.db.createIndex({ index: {fields: ["vehicles"]} });

    // Mechanic index
    this.db.createIndex({index: {fields: ["isVerified"]}});
    this.db.createIndex({index: {fields: ["aggregateRating"]}});
    this.db.createIndex({index: {fields: ["activeRequest"]}});
    this.db.createIndex({index: {fields: ["offersSent"]}});
    this.db.createIndex({index: {fields: ["awaitingVerification"]}});
  }

  // TODO: Replace functions specific to User with parent overrides where applicable (e.g. getUser becomes getRecord)

  /**
   * Returns a user document
   * @param {Object} obj Contains either an email, or an id. If given both will prefer id
   * @param {String} [obj.email]
   * @param {String} [obj.id]
   * @return {Promise<Object>} Either a user record or null
   */
  async getUser ({email, id}) {
    let record;
    if (email) {
      // console.log(await this.db.allDocs());
      // console.log(await this.db.explain({selector: {email: {$eq: email}}}));
      record = await this.db.find({selector: {email: {$eq: email}}});
      // console.log(record.docs);
      record = record.docs[0];
    }
    if (id) { record = await this.db.get(id); }
    return record;
  }

  /**
   * Sign in user with email and password
   * @param {String} email
   * @param {String} password
   * @return {Promise<DBResponse>} see DBResponse definition
   */
  async signInUser (email, password) {
    const record = await this.getUser({email});

    if (!record) {
      return {ok: false, reason: "An account with that email doesn't exist."};
    } else if (record.password !== password) {
      return {ok: false, reason: "Incorrect password."};
    }
    await AsyncStorage.setItem("signedInUserID", record._id);
    this.emit("signedIn");
    return {ok: true};
  }

  /**
   * Signs out current user
   * @return {Promise<DBResponse>} see DBResponse definition
   */
  async signOutUser () {
    await AsyncStorage.removeItem("signedInUserID");
    this.emit("signedOut");
    return {ok: true};
  }

  /**
   * Attempts to insert a new user into the database
   * @param {User} Object containing user info
   * @param {Object} options Options object
   * @param {boolean} [options.signIn=false] Whether to sign in after creating user
   * @return {Promise<DBResponse>} see DBResponse definition
   */
  async createUser (record, {signIn = false}) {
    // Check if user exists
    if (await this.getUser({email: record.email})) {
      return {ok: false, reason: "An account with that email already exists."};
    }

    // Insert into db
    const resp = await this.db.post(record._doc);

    // Set document in class to value from db
    await record.setDoc(this.db.get(resp.id));
    if (signIn) {
      await AsyncStorage.setItem("signedInUserID", resp.id);
      this.emit("signedIn");
    }
    return {ok: true, record};
  }

  async batchCreateUser () {
  }

  /**
 * Delete a user with a given email or id
 * @param {Object} obj Contains either an email, or an id. If given both will prefer id
 * @param {String} [obj.email]
 * @param {String} [obj.id]
 */
  async deleteUser ({email, id}) {
    if (id) {
      await this.db.remove(id);
    } else if (email) {
      await this.db.remove(this.getUser(email));
    }
  }

  /**
 * Delete a set of users with a given email or id. This is not in the user class as normally it would not be used
 * @param {Object} obj Contains two optional lists of emails and ids. Will work if both are given
 * @param {String[]} [obj.emails]
 * @param {String[]} [obj.ids]
 */
  async batchDeleteUser ({emails = [], ids = []}) {
    // Faster to use map as it calls all delete functions at once, rather than waiting for each to complete
    await Promise.all(ids.map(id => this.deleteUser({id})));
    await Promise.all(emails.map(email => this.deleteUser({email})));
  }

  /**
   * Updates a user in the database based on a given delta object
   * @param {Object} UserInstance The user class instance to update
   * @param {Object} delta An object containing the new values only
   */
  async updateUser (UserInstance, delta) {
    const doc = UserInstance._doc;
    await this.db.put({...doc, ...delta, _rev: doc._rev});

    // I *think* this is needed in order to get a new _rev value for next update
    await UserInstance.setDoc(await this.db.get(doc._id));
    this.emit("updatedUser");
  }

  /**
   * Gets a list of userIDs which contain the given vehicleID
   * @param {String} vehicleID
   */
  async getUsersWithVehicle (vehicleID) {
    return this.db.find({
      selector: {vehicles: {$elemMatch: vehicleID}},
      fields: ["_id"]
    }).docs;
  }

  /**
   * Loads test data into database
   * @param {Object} opts
   * @param {Boolean} opts.loadSamples Should sampledata also be loaded (For volume testing)
   * @param {Boolean} opts.upsert Should existing documents be updated/replaced to match?
   */
  async _loadTestData (opts) {
    const testData = require("@assets/data/testUsers");
    const sampleData = require("@assets/data/sampleUsers");
    super._loadTestData(opts, {testData, sampleData});
  }
}

export default new UserDB();
