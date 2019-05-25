import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button
} from "react-native";
import DatabaseService from "@lib/services/DatabaseService";
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
      DatabaseService.getServiceRequest(user.srId)
        .then(sr => {
          this.setState({
            serviceRequest: sr,
            enableRequestAssistance: !user.srId,
            enableViewCurrentOffers: user.srId && sr ? sr.status === "Awaiting offer acceptance" : false,
            enableViewActiveRequest: user.srId && sr ? sr.status === "Offer accepted" : false
          });
        }).catch(err => { throw err; });
    });
  }

  render () {
    return (
      <View>
        <HeaderBar
          navMid={<Text style={styles.heading}>Driver Home Screen</Text>}
          navRight={<View/>} // Just to center the heading
        />
        <View style={styles.buttons}>
          {!this.state.user ? null
            : <Button
              title="Request Assistance"
              onPress={() => this.props.navigation.navigate("DriverMakeRequestModal", { user: this.state.user })}
              disabled={!this.state.enableRequestAssistance}
            />
          }
        </View>
        <View style={styles.buttons}>
          {!this.state.user ? null
            : <Button
              title="View Current Offers"
              onPress={() => this.props.navigation.navigate("DriverOffersModal", { user: this.state.user })}
              disabled={!this.state.enableViewCurrentOffers}
            />
          }
        </View>
        <View style={styles.buttons}>
          {!this.state.user ? null
            : <Button
              title="View Active Assistance Request"
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
            />
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
  background: {
    backgroundColor: "black",
    width: 100,
    height: 100
  },
  buttons: {
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 2,
    marginBottom: 2
  },
  textBesideInput: {
    fontSize: 20
  },
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 5,
    width: "60%",
    paddingLeft: 5,
    backgroundColor: "white"
  },
  wideButtonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  wideButton: {
    // backgroundColor: Colors.wideButton,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5
  },
  centeredRowContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20
  },
  textBox: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 5,
    width: "90%",
    paddingLeft: 5,
    backgroundColor: "white",
    marginBottom: 5,
    alignSelf: "center"
  },
  buttonBox: {
    alignSelf: "center",
    backgroundColor: "yellow",
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 2,
    marginBottom: 2
  },
  buttonBoxText: {
    justifyContent: "center",
    padding: 10,
    fontSize: 20
  }
});
