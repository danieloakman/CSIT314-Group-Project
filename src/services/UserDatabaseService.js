import {AsyncStorage} from "react-native";
/* eslint-disable no-unused-vars */
const Driver = require("@src/components/users/Driver");
const Mechanic = require("@src/components/users/Mechanic"); // These are being used.
const Admin = require("@src/components/users/Admin");
/* eslint-enable no-unused-vars */

// todo: change this so it accesses a local file, not one in the project directory
// Use some file writing package for react-native, since fs doesn't work in it.
let allUsers = require("@assets/test-files/database").users;

export default class UserDatabaseService {
  /**
   * Returns the correct class object for the user with that email.
   * Use this to then edit the user.
   * Remember to call writeAllUsersToFile() after any edits that need to be saved.
   */
  static getUserClass (email) {
    const userRecord = allUsers[email];
    return new [userRecord.constructor](userRecord.account);
  }

  /**
   * Checks if that user exists and password matches.
   * If checks pass then stores the user's email and name in persistent app storage.
   */
  static async signInUser (email, password) {
    const userRecord = allUsers[email].account;
    if (!userRecord) {
      return {pass: false, reason: "An account with that email doesn't exist."};
    } else if (userRecord.password !== password) {
      return {pass: false, reason: "Incorrect password."};
    }

    try {
      await AsyncStorage.multiSet([
        ["userEmail", userRecord.email],
        ["userFirstName", userRecord.firstName],
        ["userLastName", userRecord.lastName]
      ]);
      return {pass: true};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at UserDatabaseService.signInUser()"
      };
    }
  }

  /**
   * Removes all key value pairs in app storage that match /user\w+/.
   */
  static async logOutCurrentUser () {
    try {
      let keys = await AsyncStorage.getAllKeys()
        .filter(key => key.match(/user\w+/));
      await AsyncStorage.multiRemove(keys);
      return {pass: true};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at UserDatabaseService.logOutUser()"
      };
    }
  }

  static async createUser (userRecord) {
    // todo:
    this.writeAllUsersToFile();
    return {pass: true};
  }

  static async writeAllUsersToFile () {
    // todo:
    return {pass: true};
  }
}
