import UserDB from "@database/user";

/**
 * Base User class
 * @abstract
 */
export default class User {
  constructor (record) {
    // All data is stored in _doc following single source of truth principles
    this._doc = record;

    // Derived properties (don't get a getter as it isn't needed)
    this.fullName = `${this.givenName} ${this.surname}`;
  }

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
   * Set doc to new document
   * @param {Object} document
   */
  async setDoc (document) {
    this._doc = document;
  }
}
