import React from "react";
import {
  TouchableOpacity
} from "react-native";
import {
  Icon,
  Toast
} from "native-base";

/**
 * Icon button that on press, displays the prop.message.
 * @prop message - The message displayed.
 * @prop iconStyle - Style object for the icon.
 * @prop toastStyle - Style object for the toast. Use fontSize to set the
 * size of the Icon.
*/
export default class BackButton extends React.Component {
  render () {
    return (
      <TouchableOpacity
        onPress={() => Toast.show({
          text: this.props.message,
          buttonText: "Okay",
          duration: 5000,
          position: "top",
          style: [{margin: 10, marginTop: 100, borderRadius: 15}, this.props.toastStyle]
        })}>
        <Icon active type="AntDesign" name="questioncircleo"
          style={[{fontSize: 40}, this.props.iconStyle]}
        />
      </TouchableOpacity>
    );
  }
}
