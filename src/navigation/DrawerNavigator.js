/*
This will be for things that don't fit on the bottom navigation bar, such as help, random legal stuff, quick access to some things from any screen, and settings (If we do any)
*/

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import {
  Content,
  // Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge,
  Header,
  Thumbnail
} from "native-base";
import { createDrawerNavigator, withNavigation } from "react-navigation";
import WindowBox from "@components/WindowBox";
import FlexContainer from "@components/FlexContainer";
import {withAuthContext} from "@lib/context/AuthContext";

import MainTabNavigator from "./MainTabNavigator";

const entries = [
  {
    name: "\"Logout\"",
    route: "Auth",
    endSection: true,
  },
  {
    name: "Profile",
    route: "Profile",
  },
  {
    name: "Home",
    route: "Home",
  },
  {
    name: "Links",
    route: "Links",
  },
  {
    name: "Settings",
    route: "Settings",
    endSection: true,
  },

];

class Drawer extends React.Component {
  renderListItem = (props) => (

    <ListItem
      button
      noBorder={!props.endSection}
      onPress={() => this.props.navigation.navigate(props.route)}
    >
      <Text>
        {props.name}
      </Text>
    </ListItem>

  );
  render () {
    let auth = this.props.AuthContext;
    return (
      <Container>
        <Content>

          <FlexContainer columnReverse style={styles.headerBox}>

            <View>
              <Text style={styles.userName}>{auth.user.firstName} {auth.user.lastName}</Text>
              <Text style={styles.email}>{auth.user.email}</Text>
            </View>

            <Thumbnail large
              source={require("@assets/images/robot-prod.png")}
              style={styles.userImage}/>

          </FlexContainer>

          <List
            dataArray={entries}
            renderRow={this.renderListItem}
          />
        </Content>
      </Container>

    )
    ;
  }
}

export default createDrawerNavigator({
  Home: MainTabNavigator,
},
{
  initialRouteName: "Home",
  contentComponent: withNavigation(withAuthContext(Drawer)),
  drawerOpenRoute: "DrawerOpen",
  drawerCloseRoute: "drawerClose",
  drawerToggleRoute: "DrawerToggle",
}
);

const styles = StyleSheet.create({
  headerBox: {
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    paddingLeft: 20,
    backgroundColor: "#eee",
  },
  userName: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontFamily: "Roboto",
    fontWeight: "100",
    marginBottom: 5,
  },
  userImage: {
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
    marginBottom: 15,
  },
});
