import React from "react";
import {
  View,
  Text,
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * For creating a spaced container box
 * @param {*} props
 */
export default function FullWidthButton (props) {
  let containerStyle = {
    height: props.height || 60,
    alignItems: "center",
    justifyItems: "center",
    flexDirection: "row-reverse",
    backgroundColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: -1,
  };
  if (props.demo) {
    containerStyle = {
      ...containerStyle,
      borderColor: "#ddd",
      borderWidth: 1,
    };
  }

  const buttonBody = (<View style={containerStyle}>
    <Ionicons style={{ flex: 1 }} size={30}
      name={
        Platform.OS === "ios"
          ? "ios-arrow-forward"
          : "md-arrow-forward"
      } />
    <Text style={{ flex: 6, fontSize: 16, textAlign: "center" }}>{props.title}</Text>
    <View style={{ flex: 1 }} />
  </View>);
  return (
    <View>
      {Platform.OS === "ios"
        ? <TouchableHighlight onPress={props.onPress} >
          {buttonBody}
        </TouchableHighlight>
        : <TouchableNativeFeedback onPress={props.onPress} >
          {buttonBody}
        </TouchableNativeFeedback>}

    </View>
  );
}
