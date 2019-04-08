/*
  A large component container with a top three-section container and a large main container
*/

import React from "react";
import {
  StyleSheet,
  View,
  // Button,
  // TextInput,
  Text,
  StatusBar,
  Platform
} from "react-native";
// import { Constants } from "expo";

import FlexContainer from "./FlexContainer";

export default function TitleBox (props) {
  const navHeight = 60;
  const styles = StyleSheet.create({
    topNav: {
      flexDirection: "row",
      backgroundColor: props.navColor || "#AAA",
      height: navHeight,
      width: "100 %"
    },
    container: {
      flex: 1
    },
    titleComponent: {
      alignItems: "center",
      justifyContent: "center",
    },
    sideButtons: {
      width: navHeight,
      height: navHeight,
    },
    bodyBox: {
      flex: 1,
      backgroundColor: props.bgColor || "#EEE",
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <FlexContainer style={[styles.titleComponent, styles.sideButtons]}>
          {props.navLeft}
        </FlexContainer>
        <FlexContainer size={1} style={styles.titleComponent}>
          {props.navMid}
        </FlexContainer>
        <FlexContainer style={[styles.titleComponent, styles.sideButtons]}>
          {props.navRight}
        </FlexContainer>
      </View>
      <View style={styles.bodyBox}>
        {props.children}
      </View>
    </View>
  );
}
