import React from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Text,
  LayoutAnimation,
  NativeModules,
} from "react-native";
import { BlurView } from "expo";

import FlexContainer from "@components/FlexContainer";
import DrawerButton from "@atoms/DrawerButton";

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const navHeight = 57;

export default class NavHeader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title: " "
    };
  }

  static getDerivedStateFromProps (props, state) {
    return {title: props.title ? props.title : ""};
  }

  componentDidUpdate () {
    // LayoutAnimation.linear();
    // this.setState({title: this.props.title ? this.props.title : " "});
  }

  render () {
    return (
      <View style={[styles.container, this.props.style, this.props.withSection ? {borderBottomWidth: 0} : null]} >
        <View style={styles.spacer}/>
        <View style={styles.topNav}>
          <FlexContainer style={[styles.titleComponent, styles.sideButtons]}>
            {this.props.navLeft ? this.props.navLeft : <DrawerButton />}
          </FlexContainer>
          <FlexContainer size={1} style={styles.titleComponent}>
            {this.props.navMid
              ? this.props.navMid
              : <Text style={styles.titleText}>{this.state.title}</Text>}
          </FlexContainer>
          <FlexContainer style={[styles.titleComponent, styles.sideButtons]}>
            {this.props.navRight}
          </FlexContainer>
        </View>
        {/* <View style={styles.bodyBox}>
        {this.props.children}
      </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: "row",
    height: navHeight,
    width: "100 %",
    paddingLeft: 15,
    paddingRight: 15
  },
  container: {
    // flex: 1
    zIndex: 5,
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#BBB",
    borderBottomWidth: 1,
  },
  titleComponent: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sideButtons: {
    minWidth: navHeight,
    height: navHeight,
  },
  // bodyBox: {
  //   flex: 1,
  //   backgroundColor: this.props.bgColor || "#EEE",
  // },
  spacer: {
    height: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
  },
  titleText: {
    fontSize: 24,
    // textAlign: "left"
  }
});
