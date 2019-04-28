import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import TabBarIcon from "@components/TabBarIcon";

import DriverProfileScreen from "@screens/DriverProfileScreen";
import DriverHomeScreen from "@screens/DriverHomeScreen";

const ProfileStack = createStackNavigator({
  Profile: DriverProfileScreen
});

ProfileStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-person${focused ? "" : "-outline"}`
          : "md-person"
      }
    />
  )
};

const DriverHomeStack = createStackNavigator({
  DriverHome: {screen: DriverHomeScreen}
});

DriverHomeStack.navigationOptions = {
  tabBarLabel: "Driver Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? "ios-home"
          : "md-home"
      }
    />
  )
};

export default createBottomTabNavigator({
  ProfileStack,
  DriverHomeStack
});
