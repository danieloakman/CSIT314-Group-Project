import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Text
} from "native-base";
import {withNavigation} from "react-navigation";
import DatabaseService from "@lib/services/DatabaseService";
import HeaderBar from "@molecules/HeaderBar";

class MechanicHomeScreen extends React.Component {
  state = {
    user: null,
    serviceRequest: null,
    enableNearbyRequests: false,
    enableViewCurrentOffers: false,
    enableViewActiveRequest: false,
  }

  componentDidMount () {
    let user = this.props.AuthContext.user;
    this.setState({user});
    const {navigation} = this.props;
    navigation.addListener("willFocus", () => { // todo: maybe make a better refresh screen method
      DatabaseService.getServiceRequest(user.srId)
        .then(sr => {
          this.setState({
            serviceRequest: sr,
            enableNearbyRequests: !user.srId && user.verifiedMechanic,
            enableViewCurrentOffers: !user.srId && user.offersSent.length > 0 && user.verifiedMechanic,
            enableViewActiveRequest: user.srId && user.verifiedMechanic
          });
        }).catch(err => { throw err; });
    });
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <HeaderBar
          title="Mechanic Home Screen"
        />
        {this.state.user &&
        <View style={{flex: 1}}>
          <View style={styles.buttonContainer}>
            <Button full info
              style={styles.button}
              onPress={() => this.props.navigation.navigate("MechanicVerificationModal", {user: this.state.user}) }
              disabled={this.state.user.awaitingVerification}
            >
              <Text style={
                this.state.user.awaitingVerification
                  ? {fontSize: 17, color: "green"}
                  : {fontSize: 17}
              }>
                {this.state.user.awaitingVerification ? "Verification in progress..." // If user is waiting to be verified.
                  : this.state.user.verifiedMechanic ? "Update your verification details" // Else if, user is verified.
                    : "Verify your Account" // Else if, user isn't verified.
                }
              </Text>
            </Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button full info
              style={styles.button}
              onPress={() => this.props.navigation.navigate("MechanicRequestListModal") }
              disabled={!this.state.enableNearbyRequests}
            >
              <Text style={{fontSize: 17}}>View Nearby Requests</Text>
            </Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button full info
              style={styles.button}
              onPress={() => this.props.navigation.navigate("MechanicRequestViewModal") }
              disabled={!this.state.enableViewCurrentOffers}
            >
              <Text style={{fontSize: 17}}>View Current Offers</Text>
            </Button>
          </View>
          <View style={[styles.buttonContainer, {marginBottom: 10}]}>
            <Button full info
              style={styles.button}
              onPress={() => this.props.navigation.navigate("MechanicRequestViewModal") }
              disabled={!this.state.enableViewActiveRequest}
            >
              <Text style={{fontSize: 17}}>View Active Assistance Request</Text>
            </Button>
          </View>
        </View>}
      </View>
    );
  }
}

export default withNavigation(MechanicHomeScreen);

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    marginTop: 2,
    marginBottom: 2,
  },
  button: {
    borderRadius: 20,
    height: "100%"
  }
});
