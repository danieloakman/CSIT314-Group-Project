import {
  Location,
  Permissions
} from "expo";

export default class LocationService {
  /**
   * Returns the latitiude-longitude location of the device running this client.
   */
  static async getClientLocation () {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return null;
    } else {
      return Location.getCurrentPositionAsync({});
    }
  }

  /**
   * Returns the address string of the passed in latitude-longitude location.
   * @param {number} latitude
   * @param {number} longitude
   */
  static async getAddress (latitude, longitude) {
    const address = (await this.reverseGeocode(latitude, longitude))[0];
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
   * Returns the address object of the passed in latitude-longitude location.
   * @param {number} latitude
   * @param {number} longitude
   */
  static async reverseGeocode (latitude, longitude) {
    if (!latitude && !longitude) return null;
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return null;
    } else {
      return Location.reverseGeocodeAsync({latitude, longitude});
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
}
