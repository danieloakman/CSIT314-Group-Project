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
// import DatabaseService from "@lib/services/DatabaseService";
import HeaderBar from "@molecules/HeaderBar";
import { withNavigation } from "react-navigation";
import {withAuthContext} from "@lib/context/AuthContext";
import LocationService from "@lib/services/LocationService";

import Offer from "@model/Offer";
import Request from "@model/Request";

class RequestView extends React.Component {
    state = {
      offerAmount: null,
      selectedSR: null,
      user: null,
      location: null,
      offerMade: false,
      isLoading: true,
      offer: null
    }
    async componentWillMount () {
      /* get parameters from the list item which was clicked */
      const { navigation } = this.props;
      const offer = await Offer.getOffer(this.props.AuthContext.user.activeOffer);
      const request = await Request.getServiceRequest(navigation.getParam("RequestID", offer.requestID));
      this.setState({
        selectedSR: request,
        user: navigation.getParam("user", this.props.AuthContext.user),
        location: navigation.getParam("location", await LocationService.getCurrentLocation())
      }, async () => {
        if (request) {
          const offer = await request.getOfferByMechanic(this.state.user.id);
          if (offer) {
            this.setState({
              offer,
              offerMade: true,
              offerAmount: offer.cost,
              isLoading: false
            });
          } else { this.setState({isLoading: false}); }
        } else {
          this.setState({isLoading: false});
        }
      });
    }
    render () {
      // console.log(this.state);
      return (
        <View>
          <HeaderBar title="Request"/>
          {!this.state.isLoading &&
          <View>
            <View>
              <Text>Distance: {`${Math.round(LocationService.getDistanceBetween(this.state.selectedSR.location.coords, this.state.location.coords) * 100) / 100}km`}</Text>
              <Text>Time: {this.state.selectedSR.creationDate.toDateString()}</Text>
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
                onPress={() => this.props.navigation.push("ProfileModal", {id: this.state.selectedSR.driverID})}
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
                disabled={this.state.offerMade}
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
          }

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
      const sr = this.state.selectedSR;
      const response = await Offer.createOffer(sr.id, this.state.user.id, this.state.offerAmount);
      // TODO: Show toast on db fail
      await sr.submitOffer(response.id);
      Toast.show({
        text: "Offer sent!",
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      this.props.navigation.goBack();
    }
}

export default withAuthContext(withNavigation(RequestView));

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
