/*
  Button to navigate back.
  Can be opened anywhere as it uses the HOC withNavigation
*/
import React from "react";
import {
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationActions, withNavigation } from "react-navigation";

function BackButton (props) {
  return (
    <Ionicons size={30}
      name={
        Platform.OS === "ios"
          ? "ios-arrow-back"
          : "md-arrow-back"
      }
      onPress={() => props.navigation.dispatch(NavigationActions.back())}
    />

  );
}

export default withNavigation(BackButton);
