import React from "react";
import {Image} from "react-native";
import UserDB from "@lib/services/UserDatabaseService";
import NavSrvc from "@lib/services/NavigationService";
/*
  database service is responsible for persisting data to disk, not current state (which needs to be within the react tree)
  changes to user database are caused by calls to database service, however an event must be emitted in order for the context to update its state
*/

/*
  Changes to state should only be caused by:
  provided methods in context provider,
  internal triggers within provider class (e.g. timers),
  eventlisteners registered within context class (e.g. listening for info update events from database service)
*/

export const AuthContext = React.createContext();

export class AuthProvider extends React.Component {
  state = {
    user: {},
    signedIn: false

  }

  async loadUser () {
    const record = await UserDB.getSignedInUser();
    if (record !== null) {
      // user is signed in
      const p = new Promise((resolve) => {
        this.setState({user: record, signedIn: false}, resolve);
      });
      await p;
      // console.log(this.state.user);
      if (record.pictureURI) {
        Image.prefetch(record.pictureURI);
      }
      NavSrvc.navigate(this.state.user.email ? "Main" : "SignIn");
    } else {
      // user is not signed in
      NavSrvc.navigate(this.state.user.email ? "Main" : "SignIn");
    }
  }

  async unloadUser () {
    const p = new Promise((resolve) => {
      this.setState({user: {}, signedIn: true}, resolve);
    });
    await p;
    NavSrvc.navigate(this.state.user.email ? "Main" : "SignIn");
  }

  async handleSignOut () {
    await this.unloadUser();
  }

  async handleSignIn () {
    await this.loadUser();
  }

  async componentDidMount () {
    // Register listener for changes to user info
    UserDB.emitter.on("signedIn", this.handleSignIn, this);
    UserDB.emitter.on("signedOut", this.handleSignOut, this);
    await this.loadUser();
  }

  componentWillUnmount () {
    // Deregister all listeners
    UserDB.emitter.off("signedIn", this.handleSignIn, this);
    UserDB.emitter.off("signedOut", this.handleSignOut, this);
  }

  render () {
    return (
      <AuthContext.Provider value={{
        user: this.state.user,
        loadUser: this.loadUser.bind(this)
      }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

/**
 * Higher order component that returns a component wrapped with an Auth context consumer
 */
export const withAuthContext = Component => {
  // Returns a function which is a component
  return props => {
    return (
      <AuthContext.Consumer>
        {(context) => <Component {...props} AuthContext={context} />}
      </AuthContext.Consumer>
    );
  };
};
