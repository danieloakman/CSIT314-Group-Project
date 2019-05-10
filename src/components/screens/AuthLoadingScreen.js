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
    // console.log("authorized");
    // this.props.navigation.navigate(auth.user.email ? "Main" : "SignIn");
  }

  async componentDidMount () {
    await this._loadSession();
  }

  render () {
    // this._loadSession(); // Aparrently this won't work in constructor because props aren't defined yet
    return (
      <View style={{justifyContent: "center", flex: 1}}>
        <ActivityIndicator size="large" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
export default withAuthContext(AuthLoadingScreen);
