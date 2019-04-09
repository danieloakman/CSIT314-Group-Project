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
  if (props.row) { style.flexDirection = "row"; }
  if (props.column) { style.flexDirection = "column"; }
  if (props.rowReverse) { style.flexDirection = "row-reverse"; }
  if (props.columnReverse) { style.flexDirection = "column-reverse"; }
  const component = <View style={[style, props.style]}>{props.children}</View>;
  return component;
}
