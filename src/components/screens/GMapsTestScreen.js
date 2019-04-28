import React from "react";
import {
  StyleSheet,
  View,
  Button,
  TextInput,
} from "react-native";
import WindowBox from "@components/WindowBox";
import Colors from "@constants/Colors";

import {MapView, Location, Permissions} from "expo";

export default class GMapsTestScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: "Google maps test"
  };

  state = {
    locationResult: null
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
          title="Geocode something"
          onPress={async () => {
            // console.log(this.state.locationResult);
          }}
        />
        <View style={{
          flex: 1
        }}>
          <MapView
            style={{
              flex: 1
            }}
            initialRegion={{
              latitude: -34.406391,
              longitude: 150.882332,
              latitudeDelta: 0.03, // 0.0922,
              longitudeDelta: 0.01 // 0.0421
            }}
            onMapReady={async () => {
              console.log("Map is ready");
              // await this._getLocationAsync();
            }}
            onPress={async (mapEvent) => {
              console.log(`mapEvent: ${mapEvent}`);
            }}
          />
        </View>
      </WindowBox>
    );
  }

  async _getLocationAsync () {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
      });
    } else {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({locationResult: JSON.stringify(location)});
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
    zIndex: 5,
  }
});
