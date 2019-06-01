import {AsyncStorage} from "react-native";
import Emitter from "events";
import LocationService from "@lib/services/LocationService";
const uuid = require("uuid/v4"); // random uuid

const UserTypes = {
  driver: require("@lib/services/users/Driver"),
  mechanic: require("@lib/services/users/Mechanic"),
  admin: require("@lib/services/users/Admin")
};

// File that can't be changed within the app:
const databaseFile = require("@assets/data/testData");

export default class DatabaseService {
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
      return new UserTypes[userRecord.type](userRecord);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.getUser() error: ${err.stack}`);
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
      console.error(`DatabaseService.getSignedInUser() error: ${err.stack}`);
      return null;
    }
  }

  /**
   * Get user(s) by specifying any number of parameters that are an attribute in the
   * User, Driver or Mechanic classes.
   * Parameters are not case-sensitive and are turned into strings for the matching.
   * @param {Boolean} filterAdmins Optional, default is true. If true, will not
   * return any users that are Admins.
   * @return An array of users or a single user if the array is only one in length.
   */
  static async getUserBySearch (params = {}, filterAdmins = true) {
    try {
      if (Object.keys(params).length === 0) return null;
      let users = await this.getDatabase(/user-/, true);
      if (!users) return null;
      let filteredUsers = [];
      for (let keyValuePair of users) {
        const userRecord = JSON.parse(keyValuePair[1]);
        if (userRecord.type === "admin" && filterAdmins) continue;
        let user = new UserTypes[userRecord.type](userRecord);
        let pass = true;
        for (let key of Object.keys(params)) {
          if ((params[key] + "").toLowerCase() !== (user[key] + "").toLowerCase()) {
            pass = false;
            break;
          }
        }
        if (!pass) continue;
        filteredUsers.push(user);
      }
      if (filteredUsers.length > 0) return filteredUsers;
      else return null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.getUserBySearch() error: ${err.stack}`);
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
      console.error(`DatabaseService.signInUser() error: ${err.stack}`);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at DatabaseService.signInUser()"
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
      console.error(`DatabaseService.signOutCurrentUser() error: ${err.stack}`);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at DatabaseService.signOutCurrentUser()"
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
      type: type.toLowerCase(),
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      registerDate: new Date()
    };
    // Check if that user exists already:
    if (await this.getUser(userRecord.email)) {
      return {pass: false, reason: "An account with that email already exists."};
    }

    // Send userRecord through the corresponding class constructor
    // to declare and initialise any attributes not passed to the creatUser() function:
    userRecord = new UserTypes[userRecord.type](userRecord);

    try {
      let keyValuePair = [
        [`user-${userRecord.email}`, JSON.stringify(userRecord)]
      ];
      if (signInAswell) {
        keyValuePair.push(["signedInUserEmail", userRecord.email]);
        this.emitter.emit("signedIn");
      }
      await AsyncStorage.multiSet(keyValuePair);
      return {pass: true};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.createUser() error: ${err.stack}`);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at DatabaseService.createUser()"
      };
    }
  }

  /**
   * Delete a single user from AsyncStorage database,
   * if it exists (won't throw an error if it doesn't).
   * @param {string} email
   */
  static async deleteUser (email) {
    try {
      await AsyncStorage.removeItem(`user-${email}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.deleteUser() error: ${err.stack}`);
    }
  }

  /**
   * Delete multiple users from AsyncStorage database,
   * if they exist (won't throw an error if they don't).
   * @param {string[]} emails Array of emails.
   */
  static async deleteMultiUsers (emails) {
    if (!Array.isArray(emails)) {
      if (emails && typeof emails === "string") emails = [emails];
      else return;
    }
    try {
      await AsyncStorage.multiRemove(
        emails.map(email => `user-${email}`)
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.deleteMultiUsers() error: ${err.stack}`);
    }
  }

  /**
   * Merges/saves a single userClassObject into AsyncStorage database. User changes should be done through user class methods.
   * @param {*} userClassObject Driver/Mechanic/Admin class object.
   */
  static async saveUserChanges (userClassObject) {
    try {
      await AsyncStorage.mergeItem(
        `user-${userClassObject.email}`,
        JSON.stringify(userClassObject)
      );
      this.emitter.emit("updatedUser");
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.saveUserChanges() error: ${err.message}`);
      return false;
    }
  }

  /**
   * Returns database object containing all keys that match a RegExp that are in AsyncStorage.
   * @param {RegExp} regex Can use: /sr-/, /user-/, /vehicle-/
   * @param {Boolean} returnArray Optional: If true, returns an array instead.
   * @returns As default returns an Object.
   */
  static async getDatabase (regex = null, returnArray = false) {
    try {
      let allUserKeys = await AsyncStorage.getAllKeys();
      if (allUserKeys.length < 1) return null;

      if (regex) {
        allUserKeys = allUserKeys.filter(key => key.match(regex));
        if (allUserKeys.length < 1) return null;
      }

      let DatabaseArr = await AsyncStorage.multiGet(allUserKeys);
      if (DatabaseArr.length < 1) return null;

      if (returnArray) return DatabaseArr;

      let Database = {};
      DatabaseArr.forEach(keyValuePair => {
        Database[keyValuePair[0]] = JSON.parse(keyValuePair[1]);
      });
      return Database;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.getDatabase() error: ${err.stack}`);
    }
  }

  /**
   * Deletes ALL keys in AsyncStorage, including "signedInUserEmail" and any others.
   */
  static async wipeDatabase () {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.wipeDatabase() error: ${err.stack}`);
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
        await this.wipeDatabase();
      }
      let database = await this.getDatabase(/user-/);
      if (!database) {
        // Initialise AsyncStorage database with the database.json file:
        database = [];
        for (let key of Object.keys(databaseFile)) {
          database.push(
            [key, JSON.stringify(databaseFile[key])]
          );
        }
        await AsyncStorage.multiSet(database);
      } else if (database && options.mergeDatabaseFile) {
        await this.mergeDatabaseFileIntoAsyncStorage();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.initialiseDatabase() error: ${err.stack}`);
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
      for (let key of Object.keys(databaseFile)) {
        mergeKeyValuePairArr.push(
          [key, JSON.stringify(databaseFile[key])]
        );
      }
      await AsyncStorage.multiMerge(mergeKeyValuePairArr);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.mergeDatabaseFileIntoAsyncStorage() error: ${err.stack}`);
    }
  }

  static async printAllKeysInDatabase (prettify = true) {
    /* eslint-disable no-console */
    let allKeys = await AsyncStorage.getAllKeys();
    if (allKeys.length > 0) console.log("\tAll key-value pairs:");
    else console.log("There are no key-value pairs!");
    let promises = [];
    allKeys.forEach(key => {
      promises.push(
        new Promise(async resolve => {
          let value = await AsyncStorage.getItem(key);
          value = prettify && value.match(/\{.+\}/i)
            ? JSON.stringify(JSON.parse(value), null, 2)
            : value;
          console.log(
            `${prettify ? "" : "\t* "}"${key}": ${value}`
          );
          resolve(true);
        })
      );
    });
    await Promise.all(promises);
    console.log(`No of keys in database: ${allKeys.length}`);
    /* eslint-enable no-console */
  }

  /**
   * The linking of the user to this vehicle should be done
   * after calling this function with saveUserChanges().
   */
  static async createVehicle (driverEmail, make, model, year, plate, vin) {
    try {
      let vehicleId = uuid();
      await AsyncStorage.setItem(
        `vehicle-${vehicleId}`,
        JSON.stringify({
          id: vehicleId,
          owners: [driverEmail],
          make,
          model,
          year,
          plate,
          vin
        })
      );
      return {pass: true, vehicleId};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.createVehicle() error: ${err.stack}`);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at DatabaseService.createVehicle()"
      };
    }
  }

  /**
   * Get a single vehicle by its id.
   * @param {string} vehicleId
   */
  static async getVehicle (vehicleId) {
    try {
      let vehicle = await AsyncStorage.getItem(`vehicle-${vehicleId}`);
      return vehicle ? JSON.parse(vehicle) : null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.getVehicle() error: ${err.stack}`);
      return null;
    }
  }

  /**
   * Get vehicle(s) by specifying any number of parameters, like make, vin, etc.
   * Parameters are not case-sensitive and are turned into strings for the matching.
   * @return An array of vehicles or a single vehicle if the array is only one in length.
   */
  static async getVehicleBySearch (params = {vehicleId: null, make: null, model: null, year: null, plate: null, vin: null}) {
    try {
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      if (Object.keys(params).length === 0) return null;
      let vehicles = await this.getDatabase(/vehicle-/, true);
      if (!vehicles) return null;
      vehicles = vehicles.filter(keyValuePair => {
        let vehicle = JSON.parse(keyValuePair[1]);
        for (let key of Object.keys(params)) {
          if ((params[key] + "").toLowerCase() !== (vehicle[key] + "").toLowerCase()) {
            return false;
          }
        }
        return true;
      }).map(keyValuePair => JSON.parse(keyValuePair[1]));
      if (vehicles.length > 0) return vehicles;
      else return null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.getVehicleBySearch() error: ${err.stack}`);
      return null;
    }
  }

  static async saveVehicleChanges (vehicleObject) {
    try {
      await AsyncStorage.mergeItem(
        `vehicle-${vehicleObject.id}`,
        JSON.stringify(vehicleObject)
      );
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.saveVehicleChanges() error: ${err.message}`);
      return false;
    }
  }

  /**
   * Delete a single vehicle from AsyncStorage database,
   * if it exists (won't throw an error if it doesn't).
   * @param {string} vehicleId
   */
  static async deleteVehicle (vehicleId) {
    try {
      await AsyncStorage.removeItem(`vehicle-${vehicleId}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.deleteVehicle() error: ${err.stack}`);
    }
  }

  /**
   * Creates a service request.
   * The checks to see if the driver and vehicle don't
   * already have an srId should be done before calling this function.
   * @param {Object} location
   * @param {string} driverEmail
   * @param {string} vehicleId
   * @param {string} description
   */
  static async createServiceRequest (location, driverEmail, vehicleId, description) {
    try {
      let srId = uuid();
      await AsyncStorage.setItem(`sr-${srId}`, JSON.stringify({
        id: srId,
        location,
        driverEmail,
        vehicleId,
        description,
        assignedMechanicEmail: null,
        offers: [],
        status: "Awaiting offer acceptance",
        creationDate: new Date(),
        completionDate: null
      }));
      return {srId, pass: true};
    } catch (err) {
      return {pass: false, reason: err.stack};
    }
  }

  static async getServiceRequest (srId) {
    try {
      let sr = await AsyncStorage.getItem(`sr-${srId}`);
      return !sr ? null : JSON.parse(sr);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`ServiceRequestUtil.getSRById() error: ${err.stack}`);
      return null;
    }
  }

  static async saveServiceRequestChanges (srObject) {
    try {
      // Delete unwanted keys:
      delete srObject.distance;

      await AsyncStorage.mergeItem(
        `sr-${srObject.id}`,
        JSON.stringify(srObject)
      );
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.saveServiceRequestChanges() error: ${err.message}`);
      return false;
    }
  }

  /**
   * Delete a single service request from AsyncStorage database,
   * if it exists (won't throw an error if it doesn't).
   * @param {string} srId
   */
  static async deleteServiceRequest (srId) {
    try {
      await AsyncStorage.removeItem(`sr-${srId}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.deleteServiceRequest() error: ${err.stack}`);
    }
  }

  /**
   * Returns a sorted array of service requests (distance in ascending order)
   * that are within kmRadius distance from location.coords.
   * @param {number} kmRadius
   * @param {locationObject} location
   */
  static async getAllSRsNearLocation (kmRadius, location) {
    let allSRs = await this.getDatabase(/sr-/);
    if (!allSRs) return [];
    return Object.keys(allSRs)
      .map(id => {
        allSRs[id].distance = LocationService.getDistanceBetween(location.coords, allSRs[id].location.coords);
        return allSRs[id];
      })
      .filter(sr => {
        return sr.distance < kmRadius;
      })
      .sort((a, b) => a.distance - b.distance);
  }

  static async createPayment (paymentObj) {
    try {
      let paymentId = uuid();
      paymentObj.id = paymentId;
      await AsyncStorage.setItem(
        `payment-${paymentId}`,
        JSON.stringify(paymentObj)
      );
      return {pass: true, paymentId: paymentId};
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.createPayment() error: ${err.stack}`);
      return {
        pass: false,
        reason: __DEV__ ? err.stack : "Internal app error at DatabaseService.createPayment()"
      };
    }
  }

  static async getPayment (paymentId) {
    try {
      let payment = await AsyncStorage.getItem(`payment-${paymentId}`);
      return payment ? JSON.parse(payment) : null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`DatabaseService.getPayment() error: ${err.stack}`);
      return null;
    }
  }
}
