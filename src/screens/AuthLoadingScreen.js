import React from "react";
import {
  ActivityIndicator,
  StatusBar,
  View,
} from "react-native";
import {withAuthContext} from "@lib/context/AuthContext";

class AuthLoadingScreen extends React.Component {
  async _loadSession () {
    let auth = this.props.AuthContext;
    await auth.loadUser();
    this.props.navigation.navigate(auth.user.email ? "Main" : "SignIn");
  }

  render () {
    this._loadSession(); // Aparrently this won't work in constructor because props aren't defined yet
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
export default withAuthContext(AuthLoadingScreen);
