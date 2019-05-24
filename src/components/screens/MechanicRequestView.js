import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  Picker
} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
import DatabaseService from "@lib/services/DatabaseService";
import GMapView from "@components/GoogleMapView";
import {MapView} from "expo";

import mechanicHomeScreen from "@components/screens/MechanicHomeScreen";
import RequestListScreen from "@components/screens/MechanicRequestList";

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
          <Text style={styles.heading}>Request</Text>
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
              onPress={() => Alert.alert("go to driver profile view")}
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
          <View style={styles.buttons}>
            {!this.state.offerMade ? true
              : <Button
                title="Back"
                onPress={() => this.props.navigation.navigate(mechanicHomeScreen)}
              />
            }
            {this.state.offerMade ? true
              : <Button
                title="Back"
                onPress={() => this.props.navigation.navigate(RequestListScreen)}
              />
            }
          </View>
        </View>
      );
    }

    async _submitOfferToServiceRequest () {
      if (!this.state.offerAmount || isNaN(parseFloat(this.state.offerAmount))) {
        Alert.alert("Please input a valid numerical amount for the offer.");
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
      Alert.alert("Offer sent!");
      // NOTE: need to change active buttons on home screen
      this.props.navigation.navigate(mechanicHomeScreen);
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
