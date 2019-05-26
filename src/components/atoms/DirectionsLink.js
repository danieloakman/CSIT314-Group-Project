import React from "react";
import {
  Linking,
  Text,
  TouchableOpacity
} from "react-native";

/**
 * A button that when clicked, opens Google maps with
 * directions to props.destination.
 */
export default class DirectionsLink extends React.Component {
  render () {
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            `http://maps.google.com/?daddr=${this.props.destination.latitude},${this.props.destination.longitude}`
          );
          this.props.onPress && this.props.onPress();
        }}>
        <Text
          style={[
            {textDecorationLine: "underline", color: "#0066ff", fontWeight: "bold"},
            this.props.style
          ]}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
