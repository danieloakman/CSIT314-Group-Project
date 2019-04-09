/*
  Button to open drawer.
  Can be opened anywhere as it uses the HOC withNavigation
*/
import React from "react";
import {
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "react-navigation-drawer";
import { withNavigation } from "react-navigation";

function DrawerButton (props) {
  return (
    <Ionicons size={30}
      name={
        Platform.OS === "ios"
          ? "ios-menu"
          : "md-menu"
      }
      onPress={() => props.navigation.dispatch(DrawerActions.openDrawer())}
    />

  );
}

export default withNavigation(DrawerButton);
