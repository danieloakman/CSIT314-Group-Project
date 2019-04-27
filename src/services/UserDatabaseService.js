import {AsyncStorage} from "react-native";
import Emitter from "tiny-emitter";

const UserTypes = {
  Driver: require("@src/components/users/Driver"),
  Mechanic: require("@src/components/users/Mechanic"),
  Admin: require("@src/components/users/Admin")
};

// File that can't be changed within the app:
const databaseFile = require("@assets/test-files/database");

export default class UserDatabaseService {
  static emitter = new Emitter();

  /**
   * Returns the correct class object for the user with that email.
   * Use this to then edit the user with Driver/Mechanic/Admin functions.
   * Remember to call saveUserChanges() after any edits that need to be saved.
   * @returns Driver/Mechanic/Admin class object.
   */
  static async getUser (email) {
    try {
      let userRecord = await AsyncStorage.getItem(`user-${email}`);
      if (!userRecord) return null;
      else userRecord = JSON.parse(userRecord);
      return new UserTypes[userRecord.constructor](userRecord.account);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.getUser() error: ${err.stack}`);
      return null;
    }
  }

  /**
   * Returns the currently signed in user.
   * @returns Driver/Mechanic/Admin class object.
   */
  static async getSignedInUser () {
    try {
      const signedInUserEmail = await AsyncStorage.getItem("signedInUserEmail");
      if (!signedInUserEmail) return null;
      else return await this.getUser(signedInUserEmail);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.getSignedInUser() error: ${err.stack}`);
      return null;
    }
  }

  /**
   * Checks if that user exists and password matches.
   * If checks pass then stores the user's email and name in persistent app storage.
   */
  static async signInUser (email, password) {
    const user = await this.getUser(email);
    if (!user) {
      return {pass: false, reason: "An account with that email doesn't exist."};
    } else if (user.password !== password) {
      return {pass: false, reason: "Incorrect password."};
    }
    try {
      await AsyncStorage.setItem("signedInUserEmail", email);
      this.emitter.emit("signedIn");
      return {pass: true};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.signInUser() error: ${err.stack}`);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at UserDatabaseService.signInUser()"
      };
    }
  }

  /**
   * Removes signedInUserEmail from AsyncStorage.
   * Note: this doesn't navigate to the Auth screen.
   */
  static async signOutCurrentUser () {
    try {
      await AsyncStorage.removeItem("signedInUserEmail");
      this.emitter.emit("signedOut");
      return {pass: true};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.signOutCurrentUser() error: ${err.stack}`);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at UserDatabaseService.signOutCurrentUser()"
      };
    }
  }

  /**
   * Checks if a user with that email already exists.
   * If check passes then the userRecord is saved to AsyncStorage.
   * It then stores the user's email and name in persistent app storage.
   * @param {boolean} signInAswell Sign this user in after creation. The default is false.
   */
  static async createUser (type, firstName, lastName, email, password, phoneNo, signInAswell = false) {
    let userRecord = {
      constructor: type,
      account: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        phoneNo: phoneNo,
      }
    };
    // Check if that user exists already:
    if (await this.getUser(userRecord.account.email)) {
      return {pass: false, reason: "An account with that email already exists."};
    }

    // Send userRecord through the corresponding class constructor
    // to declare and initialise any attributes not passed to the creatUser() function:
    userRecord.account = new UserTypes[userRecord.constructor](userRecord.account);

    try {
      let keyValuePair = [
        [`user-${userRecord.account.email}`, JSON.stringify(userRecord)]
      ];
      if (signInAswell) keyValuePair.push(["signedInUserEmail", userRecord.account.email]);
      await AsyncStorage.multiSet(keyValuePair);
      this.emitter.emit("signedIn");
      return {pass: true};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.createUser() error: ${err.stack}`);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at UserDatabaseService.createUser()"
      };
    }
  }

  /**
   * Merges/saves a single userClassObject into AsyncStorage database.
   * @param {*} userClassObject Driver/Mechanic/Admin class object.
   */
  static async saveUserChanges (userClassObject) {
    try {
      await AsyncStorage.mergeItem(
        `user-${userClassObject.email}`,
        JSON.stringify({
          constructor: userClassObject.constructor,
          account: userClassObject
        })
      );
      this.emitter.emit("updateUser");
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.saveUserChanges() error: ${err.message}`);
      return false;
    }
  }

  /**
   * Returns database object containing all users that are in AsyncStorage.
   */
  static async getUserDatabase () {
    try {
      let allUserKeys = await AsyncStorage.getAllKeys();
      if (allUserKeys.length < 1) return null;

      allUserKeys = allUserKeys.filter(key => key.match(/user-/));
      if (allUserKeys.length < 1) return null;

      let userDatabaseArr = await AsyncStorage.multiGet(allUserKeys);
      if (userDatabaseArr.length < 1) return null;

      let userDatabase = {};
      userDatabaseArr.forEach(keyValuePair => {
        userDatabase[keyValuePair[0]] = JSON.parse(keyValuePair[1]);
      });
      return userDatabase;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.getUserDatabase() error: ${err.stack}`);
    }
  }

  /**
   * If database doesn't exist in AsyncStorage, then initialise/load
   * databaseFile into it.
   * @param {Boolean} forceWipe If true, deletes all keys in AsyncStorage first.
   * This includes key: "signedInUserEmail" and any others.
   * This makes the other option useless if true.
   * @param {Boolean} mergeDatabaseFile If true AND the user database has been initialised before,
   * then calls mergeDatabaseFileIntoAsyncStorage().
   */
  static async initialiseDatabase (options = {forceWipe: false, mergeDatabaseFile: false}) {
    try {
      if (options.forceWipe) {
        // Delete ALL keys in AsyncStorage, including "signedInUserEmail" and any others:
        let keys = await AsyncStorage.getAllKeys();
        if (keys.length > 0) AsyncStorage.multiRemove(keys);
      }
      let database = await this.getUserDatabase();
      if (!database) {
        // Initialise AsyncStorage database with the database.json file:
        database = [];
        for (let key of Object.keys(databaseFile.users)) {
          database.push(
            [`user-${key}`, JSON.stringify(databaseFile.users[key])]
          );
        }
        await AsyncStorage.multiSet(database);
      } else if (database && options.mergeDatabaseFile) {
        await this.mergeDatabaseFileIntoAsyncStorage();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.initialiseDatabase() error: ${err.stack}`);
    }
  }

  /**
   * Merges databaseFile into AsyncStorage database.
   * DatabaseFile takes precendence. Keys with the same name
   * will be overwritten with the values in databaseFile.
   */
  static async mergeDatabaseFileIntoAsyncStorage () {
    try {
      let mergeKeyValuePairArr = [];
      for (let key of Object.keys(databaseFile.users)) { // just does "users" key ATM
        mergeKeyValuePairArr.push(
          [`user-${key}`, JSON.stringify(databaseFile.users[key])]
        );
      }
      await AsyncStorage.multiMerge(mergeKeyValuePairArr);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`UserDatabaseService.mergeDatabaseFileIntoAsyncStorage() error: ${err.stack}`);
    }
  }

  static async printAllKeysInDatabase () {
    /* eslint-disable no-console */
    let allKeys = await AsyncStorage.getAllKeys();
    if (allKeys.length > 0) console.log("\tAll key-value pairs:");
    else console.log("There are no key-value pairs!");
    let promises = [];
    allKeys.forEach(key => {
      promises.push(
        new Promise(async resolve => {
          console.log(
            ` * "${key}": ${JSON.stringify(await AsyncStorage.getItem(key), null, 2)}`
          );
          resolve(true);
        })
      );
    });
    await Promise.all(promises);
    /* eslint-enable no-console */
  }
}
