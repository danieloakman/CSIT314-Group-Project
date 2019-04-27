/*
  A generic driverprofile component for rendering any driver's profile
  If it is the active driver's profile, it will display an edit button
*/
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Alert
} from "react-native";

import FlexContainer from "@components/FlexContainer";
import FullWidthButton from "@atoms/FullWidthButton";
import DrawerButton from "@components/DrawerButton";
import ProfileHeader from "@molecules/ProfileHeader";
import ProfilePage from "@templates/ProfilePage";

export default class DriverProfileScreen extends React.Component {
  static navigationOptions = {
    headerTitle: "User Profile",
    headerLeft: DrawerButton,
    headerLeftContainerStyle: {
      paddingLeft: 15
    }
  };
  /*
    TODO:
    implement actual user profile
    replace user image and name with actual values at runtime
    Decompose into multiple components in order to include in mechanic profile as well

  */
  render () {
    return (
      <ProfilePage header={ProfileHeader}>
        <FullWidthButton title={"Contact Details"} onPress={() => {
          Alert.alert("Contact details button pressed!");
        }} />
        <FullWidthButton title={"Service Request History"} onPress={() => {
          Alert.alert("Service request history button pressed!");
        }} />
        <FullWidthButton title={"Registered Vehicles"} onPress={() => {
          Alert.alert("Registered vehicles button pressed!");
        }} />

        <Text>What else do we need to display here?</Text>
      </ProfilePage>
    );
  }
}
