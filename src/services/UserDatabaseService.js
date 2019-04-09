import {AsyncStorage} from "react-native";
const Driver = require("@src/components/users/Driver");
const Mechanic = require("@src/components/users/Mechanic");
const Admin = require("@src/components/users/Admin");

// todo: change this so it accesses a local file, not one in the project directory
// Use some file writing package for react-native, since fs doesn't work in it.
let allUsers = require("@assets/test-files/database").users;

export default class UserDatabaseService {
  /**
   * Returns the correct class object for the user with that email.
   * Use this to then edit the user.
   * Remember to call writeAllUsersToFile() after any edits that need to be saved.
   */
  static getUser (email) {
    const userRecord = allUsers[email];
    switch (userRecord.constructor) {
      case "Driver":
        return new Driver(userRecord.account);
      case "Mechanic":
        return new Mechanic(userRecord.account);
      case "Admin":
        return new Admin(userRecord.account);
    }
  }

  /**
   * Returns the currently logged in user
   */
  static async getLoggedInUser () {
    try {
      return this.getUser(
        await AsyncStorage.getItem("userEmail")
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
      return null;
    }
  }

  /**
   * Checks if that user exists and password matches.
   * If checks pass then stores the user's email and name in persistent app storage.
   */
  static async signInUser (email, password) {
    if (allUsers[email] === undefined) {
      return {pass: false, reason: "An account with that email doesn't exist."};
    } else if (allUsers[email].account.password !== password) {
      return {pass: false, reason: "Incorrect password."};
    }

    const userRecord = allUsers[email].account;
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

  /**
   * Checks if a user with that email already exists.
   * If check passes then the userRecord is saved to allUsers.
   * It then stores the user's email and name in persistent app storage.
   */
  static async createUserAndLogIn (userRecord) {
    if (allUsers[userRecord.account.email] !== undefined) {
      return {pass: false, reason: "An account with that email already exists."};
    }

    allUsers[userRecord.account.email] = userRecord;

    try {
      await AsyncStorage.multiSet([
        ["userEmail", userRecord.account.email],
        ["userFirstName", userRecord.account.firstName],
        ["userLastName", userRecord.account.lastName]
      ]);
      // this.writeAllUsersToFile(); // todo
      return {pass: true};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at UserDatabaseService.createUserAndLogIn()"
      };
    }
  }

  static async writeAllUsersToFile () {
    // todo:
    return {pass: true};
  }
}
