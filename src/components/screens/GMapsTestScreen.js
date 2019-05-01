import React from "react";
import {
  StyleSheet,
  View,
  Button,
  TextInput,
} from "react-native";
import WindowBox from "@components/WindowBox";
import Colors from "@constants/Colors";
import GMapView from "@components/GoogleMapView";

export default class GMapsTestScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: "Google maps test"
  };

  state = {
    region: {
      latitude: -34.406391,
      longitude: 150.882332,
      latitudeDelta: 0.03, // 0.0922,
      longitudeDelta: 0.01 // 0.0421
    }
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
        <GMapView
          // region={this.state.region}
        />
      </WindowBox>
    );
  }
}
