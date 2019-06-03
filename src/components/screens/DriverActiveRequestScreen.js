import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Slider,
  ScrollView
} from "react-native";
import {
  Toast,
  Item,
  Label,
  Input,
} from "native-base";
// import DatabaseService from "@lib/services/DatabaseService";
// import PaymentService from "@lib/services/PaymentService";
import HeaderBar from "@molecules/HeaderBar";
import {withAuthContext} from "@lib/context/AuthContext";

import Request from "@model/Request";
import Offer from "@model/Offer";
import Review from "@model/Review";
import User from "@model/user";

class ActiveServiceRequest extends React.Component {
  state = {
    request: null,
    offer: null,
    rating: 5,
    comments: "",
  }

  async componentDidMount () {
    const request = await Request.getServiceRequest(this.props.AuthContext.user.activeRequestID);
    const offer = await Offer.getOffer(request.selectedOfferID);
    this.setState({
      request,
      offer
    });
  }

  // WIP, this still needs testing:
  async _completeServiceRequest () {
    const result = await this.state.request.completeRequest();

    if (!result.ok) {
      Toast.show({
        text: "Could not complete service request, reason: " + result.reason,
        buttonText: "Okay",
        duration: 5000,
        type: "danger",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      return;
    }
    const mechanic = await User.getUser({id: this.state.offer.mechanicID});
    const review = await Review.createReview({
      value: this.state.rating,
      comment: this.state.comments,
      requestID: this.state.request.id,
      driverID: this.state.request.driverID,
      mechanicID: mechanic.id
    });
    mechanic.addRating(review);

    Toast.show({
      text: "Completed service request!",
      buttonText: "Okay",
      duration: 5000,
      type: "success",
      style: {margin: 10, marginBottom: 60, borderRadius: 15}
    });
    this.props.navigation.goBack();
  }

  async _cancelOffer () {
    Toast.show({
      text: "Cancelled assistance, please choose an another offer.",
      buttonText: "Okay",
      duration: 5000,
      type: "warning",
      style: {margin: 10, marginBottom: 60, borderRadius: 15}
    });
    this.props.navigation.goBack();
  }

  render () {
    return (
      <View>
        <HeaderBar title="Active Request" />
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Rating: {this.state.rating}/5</Text>
          <Slider
            value={this.state.rating}
            onValueChange={rating => this.setState({ rating })}
            maximumValue={5}
            minimumValue={1}
            step={0.2}
            style={{ width: "60%" }}
            ref={ref => { this.sliderInput = ref; }}
          />
        </View>
        <Item floatingLabel style={styles.centeredRowContainer}>
          <Label style={{ lineHeight: 40, textAlignVertical: "top", fontSize: 20 }}>Any additional comments:</Label>
          <Input multiline style={{ paddingTop: 20, fontSize: 20 }} />
        </Item>
        <View style={styles.buttons}>
          <Button
            title="Complete Assistance Request"
            onPress={async () => {
              await this._completeServiceRequest();
            }}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Cancel assistance and re-choose another offer"
            onPress={async () => {
              await this._cancelOffer();
            }}
          />
        </View>
      </View>
    );
  }
}

export default withAuthContext(ActiveServiceRequest);

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
