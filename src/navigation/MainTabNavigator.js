import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import TabBarIcon from "@components/TabBarIcon";

import ProfileScreen from "@screens/ProfileScreen";
import DriverHomeScreen from "@screens/DriverHomeScreen";
import MechanicHomeScreen from "@screens/MechanicHomeScreen";
import MechanicProfileScreen from "@screens/MechanicProfileScreen";
import AdminScreen from "@screens/AdminScreen";

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen
}, {
  defaultNavigationOptions: {
    header: null
  }});

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

const MechanicHomeStack = createStackNavigator({
  MechanicHome: {screen: MechanicHomeScreen}
});

MechanicHomeStack.navigationOptions = {
  tabBarLabel: "Mechanic Home",
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

const MechanicProfileStack = createStackNavigator({
  MechanicProfile: {screen: MechanicProfileScreen}
});

MechanicProfileStack.navigationOptions = {
  tabBarLabel: "Mechanic Profile",
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

const AdminStack = createStackNavigator({
  Admin: {screen: AdminScreen}
});

AdminStack.navigationOptions = {
  tabBarLabel: "Admin Screen",
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

export default createBottomTabNavigator({
  ProfileStack,
  DriverHomeStack,
  MechanicHomeStack,
  MechanicProfileStack,
  AdminStack
});
