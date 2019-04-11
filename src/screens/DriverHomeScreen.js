import React from "react";
import {
  Image,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Picker,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import WindowBox from "@components/WindowBox";
import Patterns from "@src/constants/UserInputRegex";
import UserDatabaseService from "@src/services/UserDatabaseService";

// todo: make button work

/*
<View style={{flex: 1, flexDirection: "row"}}>
  <View style={{width: 50, height: 50, backgroundColor: "powderblue"}} />
  <View style={{width: 50, height: 50, backgroundColor: "skyblue"}} />
  <View style={{width: 50, height: 50, backgroundColor: "steelblue"}} />
</View>
*/
export default class DriverHomeScreen extends React.Component {
  static navigationOptions = {
    header: null
    // title: "Sign in or create an account."
  };
  render () {
    return (
      <View>
        <Text style={styles.heading}>Home</Text>
        <Button onPress={() => { Alert.alert("button was pressed"); } } title="Request Assistance"/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  },
  heading: {
    fontSize: 100,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center"
  },
  background: {
    backgroundColor: "black",
    width: 100,
    height: 100
  }
});
