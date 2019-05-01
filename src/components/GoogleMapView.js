import React from "react";
import {
  View,
  Text
} from "react-native";
import {MapView, Location, Permissions} from "expo";

/**
 * WIP.
 * A map that initially focuses on the client's current location.
 */
export default class GMapView extends React.Component {
  state = {
    isLoading: true,
    markers: [],
    currentLocation: null // The location of whoever is running this client.
  }

  componentDidMount () {
    getLocationAsync().then(location => {
      if (location !== "Permission to access location was denied") {
        location.title = "Current Location";
        this.setState({
          isLoading: false,
          currentLocation: location,
          markers: [location]
        });
      } else this.setState({isLoading: false});
    }).catch(err => {
      throw err;
    });
  }

  render () {
    if (!this.state.isLoading && this.state.currentLocation) {
      return (
        <View style={{ flex: 1 }}>
          <MapView
            style={{
              flex: 1
            }}
            initialRegion={{
              latitude: this.state.currentLocation.coords.latitude,
              longitude: this.state.currentLocation.coords.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.01
            }}
            region={this.props.region}
            onPress={async (mapEvent) => {
              // console.log(`mapEvent: ${mapEvent}`);
            }}
          >
            {this.state.markers.map((marker, index) => {
              return (
                <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude: marker.coords.latitude,
                    longitude: marker.coords.longitude,
                  }}
                  title={marker.title}
                  description={`timestamp: ${marker.timestamp}`}
                  // image={require("@assets/images/current-location-pin.png")}
                />
              );
            })}
          </MapView>
        </View>
      );
    } else if (!this.state.isLoading && !this.state.currentLocation) {
      return <Text>Cannot display map because permission to access location was denied.</Text>;
    } else {
      return <Text>Loading...</Text>;
    }
  }
}

// Will probably move these functions to their own service file:

async function getLocationAsync () {
  let {status} = await Permissions.askAsync(Permissions.LOCATION); // Should probably ask location permission on loading of app or sign in instead.
  if (status !== "granted") {
    return "Permission to access location was denied";
  } else {
    return Location.getCurrentPositionAsync({});
  }
}

async function getAddress (coords) {
  let {status} = await Permissions.askAsync(Permissions.LOCATION); // Should probably ask location permission on loading of app or sign in instead.
  if (status !== "granted") {
    return "Permission to access location was denied";
  } else {
    return Location.reverseGeocodeAsync(coords);
  }
}
