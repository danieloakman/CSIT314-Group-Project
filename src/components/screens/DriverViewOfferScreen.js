import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button
} from "react-native";
import {
  Toast
} from "native-base";
import DatabaseService from "@lib/services/DatabaseService";
import HeaderBar from "@molecules/HeaderBar";

export default class OfferView extends React.Component {
    state = {
      user: null,
      offer: null,
      serviceRequest: null
    }

    componentWillMount () {
      /* get parameters from the list item which was clicked */
      this.setState({
        offer: this.props.navigation.getParam("offer", "The selected offer"),
        user: this.props.navigation.getParam("user", "Currently signed in driver"),
        serviceRequest: this.props.navigation.getParam("serviceRequest", "The driver's service request"),
      });
    }

    render () {
      return (
        <View>
          <HeaderBar
            navMid={<Text style={styles.heading}>Offer</Text>}
            navRight={<View/>} // Just to center the header
          />
          <View style={styles.buttonBoxText}>
            {/* <Text>Time: {waitTime}</Text> */}
            <Text>Cost: {this.state.offer.offerAmount}</Text>
            <Text>Mechnanic: {this.state.offer.mechanicEmail}</Text>
            <Text>Average Rating: {this.state.offer.mechanicRating}</Text>
            <Text>Time when offered: {this.state.offer.creationDate}</Text>
          </View>
          <View style={styles.buttons}>
            <Button
              title="View Mechanic Profile"
              onPress={() => this.props.navigation.push("ProfileModal", {email: this.state.offer.mechanicEmail})}
            />
          </View>
          <View style={styles.buttons}>
            <Button
              title="Accept Request"
              onPress={async () => {
                await this._acceptRequest();
              }}
            />
          </View>
        </View>
      );
    }
    async _acceptRequest () {
      await Promise.all([
        new Promise(async resolve => {
          // Update the service request:
          let sr = this.state.serviceRequest;
          sr.assignedMechanicEmail = this.state.offer.mechanicEmail;
          sr.status = "Offer accepted";
          await DatabaseService.saveServiceRequestChanges(sr);
          resolve(true);
        }),
        new Promise(async resolve => {
          // Update the mechanic:
          let mechanic = await DatabaseService.getUser(this.state.offer.mechanicEmail);
          mechanic.srId = this.state.serviceRequest.id;
          mechanic.offersSent = mechanic.offersSent
            .filter(srId => srId !== this.state.serviceRequest.id);
          await DatabaseService.saveUserChanges(mechanic);
          resolve(true);
        })
      ]);
      Toast.show({
        text: "Offer accepted!",
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      this.props.navigation.popToTop();
    }
}
const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "center"
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
  centeredRowContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20
  }
});
