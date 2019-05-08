import {Alert} from "react-native";
import {
  Location,
  Permissions
} from "expo";

const toRadians = (degrees) => { return degrees * (Math.PI / 180); };
const toDegrees = (radians) => { return radians / (Math.PI / 180); };

export default class LocationService {
  /**
   * Returns the latitiude-longitude location of the device running this client.
   * @param {number} maximumAge Optional: return a previously cached location
   * that is at most this old in milliseconds. Defaults to 120000ms or 2 mins
   * if not specified.
   */
  static async getCurrentLocation (maximumAge = 120000) {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return null;
    } else {
      return Promise.race([
        new Promise(async resolve => {
          resolve(await Location.getCurrentPositionAsync({maximumAge}));
        }),
        new Promise(resolve => {
          let wait = setTimeout(() => {
            clearTimeout(wait);
            // Sometimes Location.getCurrentPositionAsync() hangs indefintely.
            // So for now, when the timeout is reached return a randomLocation
            // within 50km around the uni.
            // Maybe should change this to only happen on __DEV__ eventually.
            resolve(
              this.getRandomLocation({
                latitude: -34.406419,
                longitude: 150.882327
              }, 50)
            );
          }, 3000); // Timeout of 3 seconds.
        })
      ]);
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
      else {
        return {
          addressStr: this.parseAddress(location[0]),
          metaData: location[0]
        };
      }
    }
  }

  /**
   * Returns the full address string from an address object.
   * @param {Object} address
   */
  static parseAddress (address) {
    try {
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`LocationService.parseAddress() error: ${err.stack}`);
      return "Address un-available";
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

  /**
   * Returns some random latitude-longitude location within a radius
   * around the passed in location.
   * @param {{latitude, longitude}} location latitude-longitude location coordinates
   * @param {number} radius Use kilometres if useMilesInstead is left undefined in parameter,
   * or use miles if useMilesInstead is set to true.
   * @param {Boolean} useMilesInstead Optionally use and get miles instead of the default: kilometres.
   */
  static getRandomLocation (location, radius, useMilesInstead = false) {
    const earthRadius = useMilesInstead ? 3958.8 : 6371;
    const max = {
      latitude: location.latitude + toDegrees(radius / earthRadius),
      longitude: location.longitude + toDegrees(Math.asin(radius / earthRadius)) /
        toDegrees(Math.cos(location.latitude))
    };
    const min = {
      latitude: location.latitude - toDegrees(radius / earthRadius),
      longitude: location.longitude - toDegrees(Math.asin(radius / earthRadius)) /
        toDegrees(Math.cos(location.latitude))
    };
    return {
      timestamp: Math.floor(Date.now() / 1000),
      mocked: false,
      coords: {
        latitude: Math.random() * (max.latitude - min.latitude) + min.latitude,
        longitude: Math.random() * (max.longitude - min.longitude) + min.longitude,
        heading: 0,
        speed: 0,
        altitude: 37.599998474121094,
        accuracy: 16.340999603271484
      }
    };
  }
}
