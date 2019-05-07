import {Alert} from "react-native";
import {
  Location,
  Permissions
} from "expo";

export default class LocationService {
  /**
   * Returns the latitiude-longitude location of the device running this client.
   */
  static async getCurrentLocation () {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return null;
    } else {
      return Location.getCurrentPositionAsync({});
    }
  }

  /**
   * Returns the address object of the passed in latitude-longitude location.
   * @param {number} latitude
   * @param {number} longitude
   * @returns {{addressStr: string, metaData: Object}} Address Object.
   */
  static async getAddress (latitude, longitude) {
    if (!latitude && !longitude) return null;
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return null;
    } else {
      let location = await Location.reverseGeocodeAsync({latitude, longitude});
      if (location.length === 0) return null;
      else if (location.length === 1) {
        return {
          addressStr: this.parseAddress(location[0]),
          metaData: location[0]
        };
      } else {
        return location.map(loc => {
          return {
            addressStr: this.parseAddress(loc),
            metaData: loc
          };
        });
      }
    }
  }

  /**
   * Returns the full address string from an address object.
   * @param {Object} address
   */
  static parseAddress (address) {
    if (!address) return "";
    else {
      let state;
      switch (address.region.toLowerCase()) {
        case "new south wales":
          state = "NSW";
          break;
        case "western australia":
          state = "WA";
          break;
        case "south australia":
          state = "SA";
          break;
        case "queensland":
          state = "QLD";
          break;
        case "victoria":
          state = "VIC";
          break;
        case "tasmania":
          state = "TAS";
          break;
        case "australian capital territory":
          state = "ACT";
          break;
        case "northern territory":
          state = "NT";
          break;
        default:
          state = address.region;
          break;
      }
      return `${address.name} ${address.street}, ${address.city} ${state} ${address.postalCode}`;
    }
  }

  /**
   * Returns the latitiude-longitude location of the passed in address.
   * @param {string} address
   */
  static async geocodeAddress (address) {
    if (!address) return null;
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return null;
    } else {
      return Location.geocodeAsync(address);
    }
  }

  /**
   * WIP, may not bother with this.
   * Remind user to turn on location services on device if they're disabled and ask to
   * enable location permission if they're not already.
   * Intended to be run at app startup and stop the user from using the app
   * if they don't enable location permissions, since a lot of the app won't be able
   * to function without it.
   */
  static async initialiseLocationServices () {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      throw new Error("Please enable permisions.");
    }
    if (!await Location.hasServicesEnabledAsync()) {
      Alert.alert("Please turn on location services on your device.");
    }
  }

  /**
   * Using the Haversine formula, returns the distance between coordsA and coordsB in kilometres or miles.
   * At distances greater than 1km and less than 100km, tested to be accurate within 0.5%.
   * @param {{latitude, longitude}} coordsA Latitude-longitude location coordinates of the first position.
   * @param {{latitude, longitutde}} coordsB Latitude-longitude location coordinates of the first position.
   * @param {Boolean} useMilesInstead Optionally get miles instead of the default kilometres returned value.
   */
  static getDistanceBetween (coordsA, coordsB, useMilesInstead = false) {
    const toRadians = (degrees) => { return degrees * (Math.PI / 180); };
    const dLat = toRadians(coordsB.latitude - coordsA.latitude);
    const dLon = toRadians(coordsB.longitude - coordsA.longitude);
    const radianDistance = 2 * Math.asin(Math.sqrt(
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.cos(toRadians(coordsA.latitude)) * Math.cos(toRadians(coordsB.latitude)) *
      Math.pow(Math.sin(dLon / 2), 2)
    ));
    return useMilesInstead
      ? 3958.8 * radianDistance // return in miles
      : 6371 * radianDistance; // return in kilometres
  }
}
