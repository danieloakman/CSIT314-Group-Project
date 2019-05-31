import React from "react";
import {
  Linking,
  TouchableOpacity
} from "react-native";
import {
  Text
} from "native-base";

/**
 * A button that when clicked, opens Google maps with
 * directions to props.destination.
 * @prop destination - location object containing latitude and longitude coordinates.
 * @prop title - The text displayed for the link.
 * @prop style - Optional, style of the text used for the title.
 * @prop onPress - Optional, this is called right after Google Maps is opened.
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
