import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert
} from "react-native";
import {
  Toast
} from "native-base";
import DatabaseService from "@lib/services/DatabaseService";
import HeaderBar from "@molecules/HeaderBar";

export default class RequestView extends React.Component {
    state = {
      offerAmount: null,
      selectedSR: null,
      user: null,
      location: null,
      offerMade: false,
    }
    componentWillMount () {
      /* get parameters from the list item which was clicked */
      const { navigation } = this.props;
      this.setState({
        selectedSR: navigation.getParam("selectedSR", "The selected service request"),
        user: navigation.getParam("user", "Currently signed in mechanic"),
        location: navigation.getParam("location", "Current location")
      });
    }
    render () {
      return (
        <View>
          <HeaderBar
            navMid={<Text style={styles.heading}>Request</Text>}
            navRight={<View/>} // Just to center the header
          />
          <View>
            <Text>Distance: {`${Math.round(this.state.selectedSR.distance * 100) / 100}km`}</Text>
            <Text>Time: {this.state.selectedSR.creationDate}</Text>
            <Text>Description: {this.state.selectedSR.description}</Text>
            <Text>Status: {this.state.selectedSR.status}</Text>
          </View>
          <View style={styles.buttons}>
            <Button
              title="View Car Info"
              onPress={() => Alert.alert("go to car info page for requests car")}
            />
          </View>
          <View style={styles.buttons}>
            <Button
              title="View Driver Profile"
              onPress={() => this.props.navigation.push("ProfileModal", {email: this.state.selectedSR.driverEmail})}
            />
          </View>
          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Offer Amount: $</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={offerAmount => this.setState({ offerAmount })}
              onSubmitEditing={async () => {
                await this._submitOfferToServiceRequest();
              }}
            />
          </View>
          <View style={styles.buttons}>
            <Button
              title="Make Offer"
              onPress={async () => {
                await this._submitOfferToServiceRequest();
              }}
            />
          </View>
          {/* for cancelling requests (not implemented yet) */}
          <Text>Offered Amount: ${this.state.offerAmount}</Text>
          <View style={styles.buttons}>
            <Button
              title="Cancel Offer"
              onPress={() => Alert.alert("cancel request")}
              disabled={!this.state.offerMade}
            />
          </View>
        </View>
      );
    }

    async _submitOfferToServiceRequest () {
      if (!this.state.offerAmount || isNaN(parseFloat(this.state.offerAmount))) {
        Toast.show({
          text: "Please input a valid numerical amount for the offer.",
          buttonText: "Okay",
          duration: 5000,
          type: "warning",
          style: {margin: 10, marginBottom: 60, borderRadius: 15}
        });
        return;
      }
      await Promise.all([
        new Promise(async resolve => {
          // Update the sevice request:
          let sr = this.state.selectedSR;
          sr.offers.push({
            creationDate: new Date(),
            mechanicEmail: this.state.user.email,
            mechanicRating: this.state.user.rating,
            offerAmount: this.state.offerAmount,
            location: this.state.location
          });
          await DatabaseService.saveServiceRequestChanges(sr);
          resolve(true);
        }),
        new Promise(async resolve => {
          // Update this mechanic:
          let user = this.state.user;
          user.offersSent.push(this.state.selectedSR.id);
          await DatabaseService.saveUserChanges(user);
          resolve(true);
        })
      ]);
      Toast.show({
        text: "Offer sent!",
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      // NOTE: need to change active buttons on home screen
      this.props.navigation.goBack();
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
  },
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 5,
    width: "60%",
    paddingLeft: 5,
    backgroundColor: "white"
  }
});
