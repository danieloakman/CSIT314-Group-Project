import React from "react";
import {
  View
} from "react-native";
import {
  Button,
  Icon,
  Text,
  Fab,
} from "native-base";
import {MapView} from "expo";
import LocationService from "@lib/services/LocationService";
import DatabaseService from "@lib/services/DatabaseService";
import LoadingGif from "@components/atoms/LoadingGif";

/**
 * A map that initially focuses on the client's current location.
 * Add more markers as children of this with key's that are >= 0.
 * @prop onPressCurrentLocation prop to access current location marker data.
 * @prop onLocationRetrieved to get current location after this component
 * has loaded it's map.
 * @prop onPressNext - Callback for when the the button on the right is pressed. This
 * button only appears when this is used.
 * @prop onPressPrevious - Callback for when the the button on the left is pressed. This
 * button only appears when this is used.
 * @prop topArea - A view container that's overlayed over the map at the top.
 * @prop bottomArea - A view container that's overlayed over the map at the bottom.
 */
export default class GoogleMapView extends React.Component {
  state = {
    isLoading: true,
    currentLocation: null // The location of whoever is running this client.
  }

  componentDidMount () {
    DatabaseService.getSignedInUser().then(async user => {
      let location;
      if (user.location) {
        // Try to use the user's already stored location:
        location = user.location;
      } else {
        // Retrieve the user's location:
        location = await LocationService.getCurrentLocation();
      }
      if (location) {
        if (!location.address) {
          let address = await LocationService.getAddress(
            location.coords.latitude, location.coords.longitude
          );
          location.address = address ? address.addressStr : "Address unavailable";
          user.location = location;
          await DatabaseService.saveUserChanges(user);
          location.title = "Current Location";
        }
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
            ref={ref => {
              if (ref && this.props.getRef) this.props.getRef(ref);
            }}
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
          <View
            style={{
              position: "absolute",
              alignSelf: "center",
              marginTop: 0
            }}>
            {this.props.topArea}
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              alignSelf: "center"
            }}>
            {this.props.bottomArea}
          </View>
          {this.props.onPressPrevious && <View
            style={{
              position: "absolute",
              left: -27,
              bottom: "40%",
              width: 60,
              height: 150
            }}>
            <View style={{flex: 1}}>
              <Button full
                style={{
                  flex: 1,
                  borderRadius: 30,
                  backgroundColor: "rgba(150, 150, 150, 0.3)"
                }}
                onPress={() => { this.props.onPressPrevious(); }}>
                <Icon type="MaterialIcons" name="navigate-before" style={{fontSize: 45}}/>
              </Button>
            </View>
          </View>}
          {this.props.onPressNext && <View
            style={{
              position: "absolute",
              right: -27,
              bottom: "40%",
              width: 60,
              height: 150
            }}>
            <View style={{flex: 1}}>
              <Button full
                style={{
                  flex: 1,
                  borderRadius: 30,
                  backgroundColor: "rgba(150, 150, 150, 0.3)"
                }}
                onPress={() => { this.props.onPressNext(); }}>
                <Icon type="MaterialIcons" name="navigate-next" style={{fontSize: 45, marginLeft: 0}}/>
              </Button>
            </View>
          </View>}
          {/* <Fab
            direction="up"
            position="bottomLeft"
            containerStyle={{marginBottom: 20, marginLeft: -15}}
            style={{backgroundColor: "grey"}}
            active={this.state.fabActive}
            onPress={() => this.setState({ fabActive: !this.state.fabActive })}>
            <Icon type="MaterialIcons" name="more-vert" style={{fontSize: 40}} />
            <Button info style={{backgroundColor: "grey"}}
              onPress={() => { this.props.onPressSort && this.props.onPressFabSort(); }}>
              <Icon active type="MaterialIcons" name="sort" style={{fontSize: 30}} />
            </Button>
            <Button info style={{backgroundColor: "grey"}}
              onPress={() => { this.props.onPressFabPrevious && this.props.onPressFabPrevious(); }}>
              <Icon active type="MaterialIcons" name="navigate-before" style={{fontSize: 40}} />
            </Button>
            <Button info style={{backgroundColor: "grey"}}
              onPress={() => { this.props.onPressFabNext && this.props.onPressFabNext(); }}>
              <Icon active type="MaterialIcons" name="navigate-next" style={{fontSize: 40}} />
            </Button>
          </Fab> */}
        </View>
      );
    } else if (!this.state.isLoading && !this.state.currentLocation) {
      return <Text>Cannot display map because permission to access location was denied.</Text>;
    } else {
      return <LoadingGif/>;
    }
  }
}
