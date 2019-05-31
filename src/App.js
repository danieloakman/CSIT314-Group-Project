import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Root } from "native-base";
import { AppLoading, Asset, Font, Icon, registerRootComponent } from "expo";
import { useScreens } from "react-native-screens";
import AppNavigator from "./navigation/AppNavigator";
import NavigationService from "@lib/services/NavigationService";
import DatabaseService from "@lib/services/DatabaseService";
import DB from "@database/core";

import "@database/user";
import "@database/vehicle";
import "@database/request";
import "@database/review";
import "@database/payment";

import {ThemeProvider} from "@lib/context/ThemeContext";
import {AuthProvider} from "@lib/context/AuthContext";

useScreens();

class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render () {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Root>
          <ThemeProvider>
            <AuthProvider>
              <View style={styles.container}>
                {/* {Platform.OS === "ios" && <StatusBar barStyle="default" />} */}
                <AppNavigator
                  ref={navRef => { NavigationService.setTopLevelNavigator(navRef); }}
                />
              </View>
            </AuthProvider>
          </ThemeProvider>
        </Root>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("@assets/images/robot-dev.png"),
        require("@assets/images/robot-prod.png"),
        require("@assets/images/car-broken-down.png"),
        require("@assets/images/loading.gif")
      ]),
      Font.loadAsync({
        "Roboto": require("native-base/Fonts/Roboto.ttf"),
        "Roboto_medium": require("native-base/Fonts/Roboto_medium.ttf"),
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("@assets/fonts/SpaceMono-Regular.ttf"),
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
      }),
      DB.loadTestData(),
      DatabaseService.initialiseDatabase({
        forceWipe: false, mergeDatabaseFile: false
      }),
    ]);
  };

  _handleLoadingError = error => {
    /* eslint-disable no-console */
    if (__DEV__) console.warn("App._handleLoadingError() error: " + error);
    else console.log("App._handleLoadingError() error: " + error);
    /* eslint-enable no-console */
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default registerRootComponent(App);
export {App as AppTest};
