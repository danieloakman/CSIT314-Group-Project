import React from "react";
import { withNavigation } from "react-navigation";
import DriverHomeScreen from "@screens/DriverHomeScreen";
import MechanicHomeScreen from "@screens/MechanicHomeScreen";
import AdminScreen from "@screens/AdminScreen";

class HomeScreen extends React.Component {
  render () {
    switch (this.props.AuthContext.user.type) {
      case "Driver":
        return (
          <DriverHomeScreen
            AuthContext={this.props.AuthContext}
          />
        );
      case "Mechanic":
        return (
          <MechanicHomeScreen
            AuthContext={this.props.AuthContext}
          />
        );
      case "Admin":
        return (
          <AdminScreen
            AuthContext={this.props.AuthContext}
          />
        );
      default:
        return null;
    }
  }
}

export default withNavigation(HomeScreen);
