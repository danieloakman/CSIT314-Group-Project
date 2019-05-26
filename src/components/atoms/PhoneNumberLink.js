import React from "react";
import {
  Linking,
  Text,
  TouchableOpacity
} from "react-native";

// Open the phone app with the phone number in the phoneNo prop.
export default class PhoneNumberLink extends React.Component {
  render () {
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(`tel:${this.props.phoneNo}`);
          this.props.onPress && this.props.onPress();
        }}>
        <Text
          style={[
            {textDecorationLine: "underline", color: "#0066ff", fontWeight: "bold"},
            this.props.style
          ]}>
          {this.props.phoneNo}
        </Text>
      </TouchableOpacity>
    );
  }
}
