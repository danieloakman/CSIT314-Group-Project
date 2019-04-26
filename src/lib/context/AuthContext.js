import React from "react";
import UserDB from "@src/services/UserDatabaseService";
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
    firstName: "alice",
    lastName: "bob",
    profilePicture: ""
  }

  async loadUser () {
    const record = await UserDB.getSignedInUser();
    if (record !== null) {
      this.setState({
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        phoneNo: record.phoneNo
      });
    } else {
      // user is not signed in
    }
  }

  async componentDidMount () {
    await this.loadUser();
  // Register listener for changes to user info
  }

  componentWillUnmount () {
    // Deregister all listeners
  }

  render () {
    return (
      <AuthContext.Provider value={{
        user: this.state,
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
