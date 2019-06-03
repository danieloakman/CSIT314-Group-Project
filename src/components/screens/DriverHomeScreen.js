import React from "react";
import {
  StyleSheet,
  View
} from "react-native";
import {
  Button,
  Text,
} from "native-base";
// import DatabaseService from "@lib/services/DatabaseService";
import Request from "@model/Request";
import HeaderBar from "@molecules/HeaderBar";
import { withNavigation } from "react-navigation";

class DriverHomeScreen extends React.Component {
  state = {
    user: null,
    serviceRequest: null,
    enableRequestAssistance: false,
    enableViewCurrentOffers: false,
    enableViewActiveRequest: false,
  }

  componentDidMount () {
    let user = this.props.AuthContext.user;
    this.setState({user});
    const {navigation} = this.props;
    navigation.addListener("willFocus", () => { // todo: maybe make a better refresh screen method
      Request.getServiceRequest(user.activeRequest)
        .then(sr => {
          // console.log(sr);
          const hasACardOrMembership = user.isCardValid || user.isMember;
          // console.log(user);
          // console.log(sr);
          this.setState({
            serviceRequest: sr,
            enableRequestAssistance: hasACardOrMembership &&
            !user.activeRequest,
            enableViewCurrentOffers: user.activeRequestID !== null &&
            sr ? sr.selectedOfferID === null : false,
            enableViewActiveRequest: user.activeRequestID !== null &&
            sr ? sr.selectedOfferID !== null : false
          });
        }).catch(err => { throw err; });
    });
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <HeaderBar title="Driver Home Screen"/>
        <View style={styles.buttonContainer}>
          {!this.state.user ? null
            : <Button full info
              style={styles.button}
              onPress={() => this.props.navigation.navigate("DriverPayMemDetailsModal", { user: this.state.user })}
            >
              <Text style={{fontSize: 17}}>Membership and Card Details</Text>
            </Button>
          }
        </View>
        <View style={styles.buttonContainer}>
          {!this.state.user ? null
            : <Button full info
              style={styles.button}
              onPress={() => this.props.navigation.navigate("DriverMakeRequestModal", { user: this.state.user })}
              disabled={!this.state.enableRequestAssistance}
            >
              <Text style={{fontSize: 17}}>Request Assistance</Text>
            </Button>
          }
        </View>
        <View style={styles.buttonContainer}>
          {!this.state.user ? null
            : <Button full info
              style={styles.button}
              onPress={() => this.props.navigation.navigate("DriverOffersModal", { user: this.state.user })}
              disabled={!this.state.enableViewCurrentOffers}
            >
              <Text style={{fontSize: 17}}>View Current Offers</Text>
            </Button>
          }
        </View>
        <View style={[styles.buttonContainer, {marginBottom: 10}]}>
          {!this.state.user ? null
            : <Button full info
              style={styles.button}
              onPress={() => {
                this.props.navigation.navigate(
                  "DriverActiveRequestModal",
                  {
                    user: this.state.user,
                    serviceRequest: this.state.serviceRequest
                  }
                );
              }}
              disabled={!this.state.enableViewActiveRequest}
            >
              <Text style={{fontSize: 17}}>View Active Assistance Request</Text>
            </Button>
          }
        </View>
      </View>
    );
  }
}

export default withNavigation(DriverHomeScreen);

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
