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

import WindowBox from "@components/WindowBox";
import FlexContainer from "@components/FlexContainer";
import TitleBox from "@components/TitleBox";
import FullWidthButton from "@components/FullWidthButton";

export default class DriverProfileScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  /*
    TODO: Create topnav components
    implement actual user profile
    replace user image and name with actual values at runtime
    Decompose into multiple components in order to include in mechanic profile as well

  */
  render () {
    return (
      <WindowBox navColor={"white"}>
        <TitleBox
          navColor="white"
          // navLeft={<Text>slideout</Text>} // Will open the left slideout menu with stuff that doesn't fit on bottom navigation bar (should be visible on nearly every page)
          navMid={<Text style={{ fontSize: 20 }}>User Profile</Text>} // Maybe should align left?
          navRight={<Text>dropdown</Text>} // Small dropdown with options such as edit (and others we think of)
        >
          <ScrollView contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}>
            {/* <FlexContainer size={0.2} /> */}
            {/* Profile Info */}
            <FlexContainer size={2} style={{
              justifyContent: "space-around",
              flexDirection: "row",
              // borderBottomColor: "#ddd",
              // borderBottomWidth: 1,
              marginBottom: 15,
            }} >
              {/* User image and name */}
              <FlexContainer size={2} style={{ justifyContent: "flex-start" }}>
                <Image
                  source={require("@assets/images/robot-prod.png")}
                  style={styles.userImage}
                />
                <Text style={styles.userName}>User Name</Text>
              </FlexContainer>
              {/* User description */}
              <FlexContainer size={4} style={{ marginTop: 15 }}>
                <FlexContainer size={3} />
                <Text style={{ flex: 2 }}>User description goes here</Text>
                <View style={{ flex: 4 }}>
                  <Text >Member since: joindate</Text>
                  <Text />
                  <Text>subscriberBadge if subscriber</Text>
                </View>

                <FlexContainer size={2} />
                {/* Open contact modal */}
              </FlexContainer>
              <FlexContainer size={0.5} />
            </FlexContainer>

            {/* Next profile section */}
            <FlexContainer size={1} style={{
              height: 900,

            }}>
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
            </FlexContainer>
          </ScrollView>
        </TitleBox>
      </WindowBox >
    );
  }
}

const styles = StyleSheet.create({
  userName: {
    fontSize: 16,
    alignSelf: "center",
    textAlign: "center",
  },
  userImage: {
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
    resizeMode: "cover",
    // flex: 1,
    maxWidth: 100,
    maxHeight: 100,
    alignSelf: "center"
  },
});
