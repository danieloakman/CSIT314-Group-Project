import React from "react";
import { View } from "react-native";

/**
 * For creating a spaced container box
 * @param {*} props
 */
export default function FlexContainer (props) {
  let style = {
    flex: props.size,
  };
  if (props.demo) {
    style = {
      ...style,
      borderColor: "black",
      borderWidth: 1,
    };
  }
  return (
    <View style={[style, props.style]}>{props.children}</View>
  );
}
