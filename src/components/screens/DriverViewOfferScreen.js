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
// import DatabaseService from "@lib/services/DatabaseService";
import HeaderBar from "@molecules/HeaderBar";

import Offer from "@model/Offer";
import Request from "@model/Request";
import User from "@model/user";

export default class OfferView extends React.Component {
    state = {
      offer: {},
      serviceRequest: {},
      mechanic: {},
      isLoading: true
    }

    async componentWillMount () {
      const offer = await Offer.getOffer(this.props.navigation.getParam("offerID"));
      const request = await Request.getServiceRequest(this.props.navigation.getParam("requestID"));
      const mechanic = await User.getUser({id: offer.mechanicID});
      this.setState({
        offer,
        serviceRequest: request,
        mechanic,
        isLoading: false
      });
    }

    render () {
      return (
        <View>
          <HeaderBar
            title="Offer"
          />
          {!this.state.isLoading &&
          <View>
            <View style={styles.buttonBoxText}>
              {/* <Text>Time: {waitTime}</Text> */}
              <Text>Cost: {this.state.offer.cost}</Text>
              <Text>Mechanic: {this.state.mechanic.email}</Text>
              <Text>Average Rating: {this.state.mechanic.aggregateRating}</Text>
              <Text>Time when offered: {this.state.offer.creationDate.toDateString()}</Text>
            </View>
            <View style={styles.buttons}>
              <Button
                title="View Mechanic Profile"
                onPress={() => this.props.navigation.push("ProfileModal", {id: this.state.mechanic.id})}
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
          }
        </View>
      );
    }
    async _acceptRequest () {
      this.state.serviceRequest.acceptOffer(this.state.offer.id);
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
