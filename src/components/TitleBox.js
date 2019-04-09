/*
  DEPRECATED. use header from react navigation instead
  A large component container with a top three-section container and a large main container
*/

import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { BlurView } from "expo";

import FlexContainer from "./FlexContainer";
import DrawerButton from "./DrawerButton";

export default function TitleBox (props) {
  const navHeight = 60;
  const styles = StyleSheet.create({
    topNav: {
      flexDirection: "row",
      // backgroundColor: props.navColor || "#AAA",
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
    <View style={styles.container} >
      <BlurView style={styles.topNav} tint="light" intensity={50}>
        <FlexContainer style={[styles.titleComponent, styles.sideButtons]}>
          {props.navLeft ? props.navLeft : <DrawerButton />}
        </FlexContainer>
        <FlexContainer size={1} style={styles.titleComponent}>
          {props.navMid}
        </FlexContainer>
        <FlexContainer style={[styles.titleComponent, styles.sideButtons]}>
          {props.navRight}
        </FlexContainer>
      </BlurView>
      <View style={styles.bodyBox}>
        {props.children}
      </View>
    </View>
  );
}
