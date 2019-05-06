/*
This will be for things that don't fit on the bottom navigation bar, such as help, random legal stuff, quick access to some things from any screen, and settings (If we do any)
*/

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import {
  Content,
  List,
  ListItem,
  Container,
  Thumbnail
} from "native-base";

import { createDrawerNavigator, withNavigation, createStackNavigator } from "react-navigation";
import FlexContainer from "@components/FlexContainer";
import {withAuthContext} from "@lib/context/AuthContext";
import DB from "@lib/services/DatabaseService";

import HomeScreen from "@screens/HomeScreen";
import LinksScreen from "@screens/LinksScreen";
import SettingsScreen from "@screens/SettingsScreen";
import ExpoSettingsScreen from "@screens/ExpoSettingsScreen";
import DeveloperScreen from "@screens/DeveloperScreen";
import MainTabNavigator from "./MainTabNavigator";

// Button definitions to be used to construct the drawer
const entries = [
  {
    name: "Logout",
    action: DB.signOutCurrentUser.bind(DB),
    route: "SignIn",
    endSection: true,
  },
  {
    name: "Profile",
    route: "Profile",
  },
  // {
  //   name: "Home",
  //   route: "Tabs",
  // },
  {
    name: "Settings",
    route: "Settings",
    endSection: true,
  },
  {
    name: "Links",
    route: "Links",
  },
  {
    name: "DEV OPTIONS",
    route: "Developer",
    hide: !__DEV__
  },
  {
    name: "Expo Settings",
    route: "ExpoSettings",
    hide: !__DEV__
  },

];

class Drawer extends React.Component {
  renderListItem = (props) => !props.hide ? (
    <ListItem
      button
      noBorder={!props.endSection}
      onPress={() => {
        if (props.action) {
          props.action();
        }
        if (props.route) {
          this.props.navigation.navigate(props.route);
        }
      }}
    >
      <Text>
        {props.name}
      </Text>
    </ListItem>

  ) : (null);
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

const DeveloperStack = createStackNavigator({
  Developer: DeveloperScreen
},
{
  headerMode: "float"
});

const ExpoSettingsStack = createStackNavigator({
  ExpoSettings: ExpoSettingsScreen
},
{
  headerMode: "float"
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
},
{
  headerMode: "float"
});

const LinksStack = createStackNavigator({
  Links: LinksScreen
},
{
  headerMode: "float"
});

export default createDrawerNavigator({
  Tabs: MainTabNavigator,
  Links: LinksStack,
  Settings: SettingsStack,
  Developer: DeveloperStack,
  ExpoSettings: ExpoSettingsStack
},
{
  initialRouteName: "Tabs",
  contentComponent: withNavigation(withAuthContext(Drawer)),
  drawerOpenRoute: "DrawerOpen",
  drawerCloseRoute: "drawerClose",
  drawerToggleRoute: "DrawerToggle",
  edgeWidth: 800
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
