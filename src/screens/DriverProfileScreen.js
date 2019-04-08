
import React from "react";
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  Text
} from "react-native";
import { Constants } from "expo";

import WindowBox from "@components/WindowBox";
import FlexContainer from "@components/FlexContainer";
import TitleBox from "@components/TitleBox";

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  /*
    TODO: Create topnav components
    implement actual user profile

  */
  render () {
    return (
      <WindowBox navColor={"white"}>
        <TitleBox
          navColor="white"
          navLeft={<Text>slideout</Text>} // Will open the left slideout menu with stuff that doesn't fit on bottom navigation bar (should be visible on nearly every page)
          navMid={<Text style={{ fontSize: 20 }}>User Profile</Text>} // Maybe should align left?
          navRight={<Text>dropdown</Text>} // Small dropdown with options such as edit (and others we think of)
        >
          <FlexContainer size={1}>
            <FlexContainer size={0.5} />
            <FlexContainer size={1} style={{ justifyContent: "space-around" }} >
              <Text style={styles.title}>User Name</Text>
            </FlexContainer>
            <FlexContainer size={1} style={{ justifyContent: "space-around" }} >

            </FlexContainer>
            <FlexContainer size={0.5} />
            <FlexContainer size={3} style={{ justifyContent: "center" }}>

            </FlexContainer>
            <FlexContainer size={1} style={{ flexDirection: "column-reverse" }}>

            </FlexContainer>
          </FlexContainer>
        </TitleBox>
      </WindowBox >
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 25,
    alignSelf: "center",
  },
  textInput: {
    padding: 5,
    margin: 3,
    flex: 0,
    borderColor: "black",
    borderWidth: 1,
    width: "60%",
    alignSelf: "center"
  },
  button: {
    width: "50%",
  }
});
