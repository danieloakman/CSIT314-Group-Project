import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import TabBarIcon from "@components/TabBarIcon";

import ProfileScreen from "@screens/ProfileScreen";
import EditProfileScreen from "@screens/EditProfileScreen";
import SearchScreen from "@screens/SearchScreen";
import DriverHomeScreen from "@screens/DriverHomeScreen";
import MechanicHomeScreen from "@screens/MechanicHomeScreen";
import MechanicProfileScreen from "@screens/MechanicProfileScreen";
import AdminScreen from "@screens/AdminScreen";
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

class HomeScreen extends React.Component {
  render () {
    let user = this.props.AuthContext.user;
    switch (user.type) {
      case "driver":
        return <DriverHomeScreen/>;
      case "mechanic":
        return <MechanicHomeScreen/>;
      case "admin":
        return <AdminScreen/>;
      default:
        return null;
    }
  }
}

const HomeStack = createStackNavigator({
  Home: withAuthContext(HomeScreen)
});

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

},
{
  initialRouteName: "TabStack",
  mode: "modal",
  headerMode: "none"
}
);

export default ModalStack;
