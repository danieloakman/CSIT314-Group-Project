import React from "react";
import {
  View,
  Text
} from "react-native";
import {MapView} from "expo";
import LocationService from "@lib/services/LocationService";

/**
 * A map that initially focuses on the client's current location.
 * Add more markers as children of this with key's that are >= 0.
 * Can use onPressCurrentLocation prop to access current location marker data.
 * Can use onLocationRetrieved to get current location after this component
 * has loaded it's map.
 */
export default class GMapView extends React.Component {
  state = {
    isLoading: true,
    currentLocation: null // The location of whoever is running this client.
  }

  componentDidMount () {
    LocationService.getCurrentLocation().then(async location => {
      if (location) {
        let address = await LocationService.getAddress(
          location.coords.latitude, location.coords.longitude
        );
        location.address = address ? address.addressStr : "Address unavailable";
        location.title = "Current Location";
        this.setState({
          isLoading: false,
          currentLocation: location,
        });
      } else this.setState({isLoading: false});
    }).catch(err => {
      throw err;
    });
  }

  render () {
    if (!this.state.isLoading && this.state.currentLocation) {
      return (
        <View style={{flex: 1}}>
          <MapView
            style={{flex: 1}}
            initialRegion={{
              latitude: this.state.currentLocation.coords.latitude,
              longitude: this.state.currentLocation.coords.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.01
            }}
            onMapReady={() => {
              if (this.props.onLocationRetrieved !== undefined) {
                this.props.onLocationRetrieved(this.state.currentLocation);
              }
            }}
            {...this.props}
          >
            <MapView.Marker
              key={-1}
              coordinate={{
                latitude: this.state.currentLocation.coords.latitude,
                longitude: this.state.currentLocation.coords.longitude,
              }}
              title="Current Location"
              description={this.state.currentLocation.address}
              pinColor="#1256cc"
              onPress={() => {
                if (this.props.onPressCurrentLocation !== undefined) {
                  this.props.onPressCurrentLocation(this.state.currentLocation);
                }
              }}
            />
            {this.props.children}
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
