import UserDB from "@database/user";
import ModelWithDbConnection from "@model/ModelWithDbConnection";
import {AsyncStorage} from "react-native";

/**
 * Base User class
 * @abstract
 */
export default class User extends ModelWithDbConnection {
  static UserTypes = {User};

  constructor (record) {
    super(record);

    // Derived properties (don't get a getter as it isn't needed)
    this.fullName = `${this.givenName} ${this.surname}`;
  }

  /**
   * Initialize child fields with default values
   */
  async init () {}

  /**
   * Returns the correct user class instance for a specified email or id.
   * @param {Object} identifier Contains either an email, or an id. If given both will prefer id
   * @param {String} [identifier.email]
   * @param {String} [identifier.id]
   * @return {Promise<Object>} User instance
   */
  static async getUser (identifier) {
    const record = await UserDB.getUser(identifier);
    if (record) { return new User.UserTypes[record.type](record); }
    return null;
  }

  /**
   * Gets the currently signed in user
   * @return {Promise<Object> | Promise<null>} User instance
   */
  static async getCurrentUser () {
    const id = await AsyncStorage.getItem("signedInUserID");
    if (!id) return null;
    const record = await this.getUser({id});
    return record;
  }

  /**
 * @typedef {Object} UserInstantiator
 * @property {String} type can be driver, mechanic or admin
 * @property {String} givenName
 * @property {String} surname
 * @property {String} email
 * @property {String} password
 * @property {String | Number} phoneNo
 */

  /**
   * Creates a user class and attempts to insert into database
   * @param {UserInstantiator} Object containing user info
   * @param {Object} options Options object
   * @param {boolean} [options.signIn=false] Whether to sign in after creating user
   * @return {Promise<DBResponse>} see DBResponse definition
   */
  static async createUser ({type, givenName, surname, email, password, phoneNo}, {signIn = false}) {
    const record = {
      type, givenName, surname, email, password, phoneNo
    };
    const constructedAccount = new User.UserTypes[type](record);
    await constructedAccount.init();
    return UserDB.createUser(constructedAccount, signIn);
  }

  /**
 * Delete a user with a given email or id
 * @param {Object} identifier Contains either an email, or an id. If given both will prefer id
 * @param {String} [identifier.email]
 * @param {String} [identifier.id]
 */
  static async deleteUser (identifier) {
    // TODO: Remove all references to user
    return UserDB.deleteUser(identifier);
  }

  // Sign in and out should be done through user model (aka this class) rather than db in case we ever want to do more in the abstraction layer
  static signInUser = UserDB.signInUser.bind(UserDB);
  static signOutUser = UserDB.signOutUser.bind(UserDB);

  // Getters to access document properties (Use as if class attribute)
  get type () { return this._doc.type; }
  get givenName () { return this._doc.givenName; }
  get surname () { return this._doc.surname; }
  get email () { return this._doc.email; }
  get password () { return this._doc.password; }
  get phoneNo () { return this._doc.phoneNo; }
  get registerDate () { return this._doc.registerDate; }
  get pictureURI () { return this._doc.pictureURI; }

  // Setters to update properties on a user

  async setGivenName (givenName) {
    await UserDB.updateUser(this, {givenName});
    this.fullName = `${this.givenName} ${this.surname}`;
  }

  async setSurname (surname) {
    await UserDB.updateUser(this, {surname});
    this.fullName = `${this.givenName} ${this.surname}`;
  }

  async setEmail (email) {
    await UserDB.updateUser(this, {email});
  }

  async setPhoneNo (phoneNo) {
    await UserDB.updateUser(this, {phoneNo});
  }

  async setRegisterDate (registerDate) {
    await UserDB.updateUser(this, {registerDate});
  }

  async setPictureURI (pictureURI) {
    await UserDB.updateUser(this, {pictureURI});
  }

  /**
   * Sets multiple values in the user at once
   * @param {Object} delta The delta object containing changed values
   */
  async setMulti (delta) {
    await UserDB.updateUser(this, delta);
  }
}
