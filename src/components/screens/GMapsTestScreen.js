/* eslint-disable no-console */
import React from "react";
import {
  Button,
  TextInput,
  Alert
} from "react-native";
import WindowBox from "@components/WindowBox";
import GMapView from "@components/GoogleMapView";
import LocationService from "@lib/services/LocationService";
import {MapView} from "expo";

export default class GMapsTestScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: "Google maps test"
  };

  state = {
    markers: [
      {
        title: "user1",
        coords: {
          latitude: -34.405095022677685,
          longitude: 150.87872529038577
        }
      },
      {
        title: "user2",
        coords: {
          latitude: -34.419478234665725,
          longitude: 150.8994684222853
        }
      },
      {
        title: "user3",
        coords: {
          latitude: -34.4338501240666,
          longitude: 150.87432003056168
        }
      }
    ],
    address: ""
  }

  render () {
    return (
      <WindowBox>
        <Button
          title="Go back"
          onPress={async () => {
            this.props.navigation.navigate("Auth");
          }}
          style={{}}
        />
        <TextInput
          editable={true}
          onChangeText={input => this.setState({ address: input })}
          placeholder="address"
          value={this.state.address}
          autoCapitalize="none"
        />
        <Button
          title="Geocode the above address"
          onPress={async () => {
            Alert.alert(JSON.stringify(await LocationService.geocodeAddress(this.state.address)));
          }}
        />
        <GMapView
          onPress={(mapEvent) => {
            Object.keys(mapEvent).forEach(key => console.log(`${key}: ${mapEvent[key]}`));
          }}
          onPressCurrentLocation={(marker) => console.log(`marker: ${JSON.stringify(marker)}`)}
        >
          {this.state.markers.map((marker, index) => {
            return <MapView.Marker
              key={index}
              coordinate={marker.coords}
              title={marker.title}
              onPress={() => { console.log(JSON.stringify(marker)); }}
            />;
          })}
        </GMapView>
      </WindowBox>
    );
  }
}
