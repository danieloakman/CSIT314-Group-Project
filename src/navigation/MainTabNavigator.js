import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import TabBarIcon from "@components/TabBarIcon";

import ProfileScreen from "@screens/ProfileScreen";
import EditProfileScreen from "@screens/EditProfileScreen";
import SearchScreen from "@screens/SearchScreen";
import HomeScreen from "@screens/HomeScreen";

import DriverActiveRequestScreen from "@screens/DriverActiveRequestScreen";
import DriverMakeRequestScreen from "@screens/DriverMakeRequestScreen";
import DriverOffersScreen from "@screens/DriverOffersScreen";
import DriverViewOfferScreen from "@screens/DriverViewOfferScreen";

import MechanicRequestViewScreen from "@components/screens/MechanicRequestView";
import MechanicRequestListScreen from "@components/screens/MechanicRequestList";

import AdminVerificationScreen from "@components/screens/AdminVerificationScreen";

import {withAuthContext} from "@lib/context/AuthContext";

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

const SearchStack = createStackNavigator({
  Search: SearchScreen
}, {
  defaultNavigationOptions: {
    header: null
  }});

SearchStack.navigationOptions = {
  tabBarLabel: "Search",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-search${focused ? "" : "-outline"}`
          : "md-search"
      }
    />
  )
};

const HomeStack = createStackNavigator({
  Home: withAuthContext(HomeScreen)
}, {
  defaultNavigationOptions: {
    header: null
  }});

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
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

const TabStack = createBottomTabNavigator({
  ProfileStack,
  SearchStack,
  HomeStack
},
{
  initialRouteName: "ProfileStack"
});

const ModalStack = createStackNavigator({
  TabStack,
  EditProfileModal: EditProfileScreen,
  ProfileModal: ProfileScreen,
  DriverActiveRequestModal: DriverActiveRequestScreen,
  DriverMakeRequestModal: DriverMakeRequestScreen,
  DriverOffersModal: DriverOffersScreen,
  DriverViewOfferModal: DriverViewOfferScreen,
  MechanicRequestViewModal: MechanicRequestViewScreen,
  MechanicRequestListModal: MechanicRequestListScreen,
  AdminVerificationModal: AdminVerificationScreen
},
{
  initialRouteName: "TabStack",
  mode: "modal",
  headerMode: "none"
}
);

export default ModalStack;
