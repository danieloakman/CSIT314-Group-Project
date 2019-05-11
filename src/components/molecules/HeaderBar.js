import React from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Text,
} from "react-native";

import FlexContainer from "@components/FlexContainer";
import DrawerButton from "@atoms/DrawerButton";
import BackButton from "@atoms/BackButton";
import { withNavigation } from "react-navigation";

const navHeight = 57;

class NavHeader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title: " "
    };
  }

  static getDerivedStateFromProps (props, state) {
    return {title: props.title ? props.title : ""};
  }

  _renderDrawerButton () {
    const index = this.props.navigation.dangerouslyGetParent().state.index;
    return (
      index <= 0
        ? <DrawerButton />
        : <BackButton />
    );
  }

  render () {
    return (
      <View style={[styles.container, this.props.style, this.props.withSection ? {borderBottomWidth: 0} : null]} >
        <View style={styles.spacer}/>
        <View style={styles.topNav}>
          <FlexContainer style={[styles.titleComponent, styles.sideButtons]}>
            {this.props.navLeft ? this.props.navLeft : this._renderDrawerButton()}
          </FlexContainer>
          <FlexContainer size={1} style={styles.titleComponent}>
            {this.props.navMid
              ? this.props.navMid
              : <Text style={styles.titleText}>{this.state.title}</Text>}
          </FlexContainer>
          {this.props.navRight
            ? <FlexContainer style={[styles.titleComponent, styles.sideButtons]}>
              {this.props.navRight}
            </FlexContainer>
            : null}
        </View>
      </View>
    );
  }
}

export default withNavigation(NavHeader);

const styles = StyleSheet.create({
  topNav: {
    flexDirection: "row",
    height: navHeight,
    width: "100 %",
    paddingLeft: 15,
    paddingRight: 15
  },
  container: {
    zIndex: 5,
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#BBB",
    borderBottomWidth: 1,
    paddingTop: 5
  },
  titleComponent: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sideButtons: {
    minWidth: navHeight,
    height: navHeight,
  },
  spacer: {
    height: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
  },
  titleText: {
    fontSize: 24,
  }
});
