import DBConnector from "./core";
import {AsyncStorage} from "react-native";

/**
  * @typedef {Object} DBResponse
  * @property {Boolean} ok Whether request was successful
  * @property {String} [reason] Reason for failure
  */

class UserDB extends DBConnector {
  constructor () {
    super("db.users");
    this.db.createIndex({index: {fields: ["email", "fname", "lname", "pnumber", "type"]}});
  }

  /**
   * Returns a user document
   * @param {Object} obj Contains either an email, or an id. If given both will prefer id
   * @param {String} [obj.email]
   * @param {String} [obj.id]
   * @return {Promise<Object>} Either a user record or null
   */
  async getUser ({email, id}) {
    let record;
    if (email) { record = await this.db.find({selector: {email}})[0]; }
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
    if (await this.getUser({id: record._id})) {
      return {ok: false, reason: "An account with that email already exists."};
    }
    await this.db.put(record);
    if (signIn) {
      await AsyncStorage.setItem("signedInUserID", record._id);
      this.emit("signedIn");
    }
    return {ok: true};
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
 * Delete a set of users with a given email or id
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
    const {doc} = UserInstance;
    await this.db.put({...doc, ...delta, _rev: doc._rev});

    // I *think* this is needed in order to get a new _rev value for next update
    await UserInstance.setDoc(await this.db.get(doc._id));
    this.emit("updatedUser");
  }

  /**
   * Loads test data into database
   */
  async _loadTestData () {
    const source = require("@assets/data/testData");
    this.db.bulkDocs(source);
  }
}

export default new UserDB();
