import {AsyncStorage} from "react-native";
const Driver = require("@src/components/users/Driver");
const Mechanic = require("@src/components/users/Mechanic");
const Admin = require("@src/components/users/Admin");

// File that can't be changed within the app:
const databaseFile = require("@assets/test-files/database");

export default class UserDatabaseService {
  /**
   * Returns the correct class object for the user with that email.
   * Use this to then edit the user with Driver/Mechanic/Admin functions.
   * Remember to call saveUserChanges() after any edits that need to be saved.
   * @returns Driver/Mechanic/Admin class object.
   */
  static getUser (email) {
    const userRecord = UserDatabaseService.allUsers[email];
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
   * Returns the currently logged in user.
   * @returns Driver/Mechanic/Admin class object.
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
    if (UserDatabaseService.allUsers[email] === undefined) {
      return {pass: false, reason: "An account with that email doesn't exist."};
    } else if (UserDatabaseService.allUsers[email].account.password !== password) {
      return {pass: false, reason: "Incorrect password."};
    }

    const userRecord = UserDatabaseService.allUsers[email].account;
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
   * Removes all key value pairs in AsyncStorage that match /user\w+/.
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
    if (UserDatabaseService.allUsers[userRecord.account.email] !== undefined) {
      return {pass: false, reason: "An account with that email already exists."};
    }

    UserDatabaseService.allUsers[userRecord.account.email] = userRecord;
    try {
      await AsyncStorage.multiSet([
        ["userEmail", userRecord.account.email],
        ["userFirstName", userRecord.account.firstName],
        ["userLastName", userRecord.account.lastName]
      ]);
      await this.mergeAllUsersIntoAsyncStorage();
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

  /**
   * Merges/saves a single userClassObject into AsyncStorage database.
   * @param {*} userClassObject Driver/Mechanic/Admin class object.
   */
  static async saveUserChanges (userClassObject) {
    try {
      // NOTE: In the future, may need to optimise this further, as in do our own merge for a single user.
      await AsyncStorage.mergeItem(
        "database", JSON.stringify({users: userClassObject})
      );
      // Re-load UserDatabaseService.allUsers with the newly merged user database
      UserDatabaseService.allUsers = await this.getUserDatabase();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error();
    }
  }

  /**
   * Todo: finish this.
   * @param userArr Array of user class objects.
   */
  static async saveMultiUserChanges (userArr) {
    // if (!isArray(userArr)) return;
  }

  /**
   * Returns database.users in AsyncStorage, if it exists.
   * If it doesn't exist for some reason (shouldn't do), then returns the users
   * in "assets/test-file/database.json" as a default.
   * @returns Entire database.users object.
   */
  static async getUserDatabase () {
    try {
      let userDatabase = await AsyncStorage.getItem("database");
      return userDatabase ? JSON.parse(userDatabase).users : databaseFile.users;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
    }
  }

  /**
   * If database doesn't exist in AsyncStorage, then initialise/load
   * databaseFile into it.
   * @param {Boolean} forceOverwrite If true, AsyncStorage database
   * will always be completely overwritten with databaseFile.
   */
  static async initialiseDatabase (forceOverwrite = false) {
    try {
      let asyncStorageDB = await AsyncStorage.getItem("database");
      if (!asyncStorageDB || forceOverwrite) {
        // Initialise AsyncStorage database with the database.json file:
        await AsyncStorage.setItem("database", JSON.stringify(databaseFile));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
    }
  }

  /**
   * Merges databaseFile into AsyncStorage database.
   * databaseFile takes precendence. Keys with the same name
   * will be overwritten with the values in databaseFile.
   */
  static async mergeDatabaseFileIntoAsyncStorage () {
    try {
      await AsyncStorage.mergeItem("database", JSON.stringify(databaseFile));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  /**
   * Merges UserDatabaseService.allUsers into AsyncStorage database.
   * UserDatabaseService.allUsers takes precendence. Keys with the same name
   * will be overwritten with the values in UserDatabaseService.allUsers.
   */
  static async mergeAllUsersIntoAsyncStorage () {
    try {
      await AsyncStorage.mergeItem("database", JSON.stringify({users: UserDatabaseService.allUsers}));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}

// Use this static variable to help limit the number of calls to AsyncStorage.
// May just circumvent this and just use getUserDatabase() if there's not much performance loss.
UserDatabaseService.getUserDatabase().then(result => {
  UserDatabaseService.allUsers = result;
  return true;
}).catch(err => { throw err; });
