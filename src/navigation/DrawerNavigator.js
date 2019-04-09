/*
This will be for things that don't fit on the bottom navigation bar, such as help, random legal stuff, quick access to some things from any screen, and settings (If we do any)
*/

import React from "react";
import {
  View,
  Text,
} from "react-native";
import { createDrawerNavigator } from "react-navigation";
import WindowBox from "@components/WindowBox";

import MainTabNavigator from "./MainTabNavigator";

const customDrawer = (props) => (
  <WindowBox>
    <View>
      <Text>todo: User name and image here</Text>
      <Text>todo: List of extra app screens to navigate to</Text>
    </View>
  </WindowBox>

);

export default createDrawerNavigator({
  Home: MainTabNavigator,
},
{
  initialRouteName: "Home",
  contentComponent: customDrawer,
  drawerOpenRoute: "DrawerOpen",
  drawerCloseRoute: "drawerClose",
  drawerToggleRoute: "DrawerToggle",
}
);
