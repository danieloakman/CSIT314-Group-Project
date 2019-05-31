import React from "react";
import {
  Linking,
  TouchableOpacity
} from "react-native";
import {
  Text
} from "native-base";

/**
 * Open the phone app with the phone number in the phoneNo prop.
 * @prop phoneNo - The phone number that is displayed.
 * @prop onPress - Optional, this is called right after the phone app is opened.
 * @prop style - Optional, style of the text used for the phone number.
 */
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
