import React from "react";
import {
  StyleSheet,
  View,
  // Button,
  // TextInput,
  // Text,
  StatusBar,
  Platform
} from "react-native";
// import { Constants } from "expo";

export default function WindowBox (props) {
  const styles = StyleSheet.create({
    statusBarUnderlay: {
      backgroundColor: props.navColor || "#00000000",
      height: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
      width: "100 %"
    },
    container: {
      flex: 1
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={"#fff"} />
      <View style={styles.statusBarUnderlay}></View>
      {props.children}
    </View>
  );
}
