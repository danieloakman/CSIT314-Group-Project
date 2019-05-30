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
import DatabaseService from "@lib/services/DatabaseService";
import PaymentService from "@lib/services/PaymentService";
import HeaderBar from "@molecules/HeaderBar";

export default class ActiveServiceRequest extends React.Component {
    state = {
      user: null,
      serviceRequest: null,
      rating: 5,
      comments: "",
    }

    componentDidMount () {
      this.setState({
        user: this.props.navigation.getParam("user", "Currently signed in driver"),
        serviceRequest: this.props.navigation.getParam("serviceRequest")
      });
    }

	// WIP, this still needs testing:
    async _completeServiceRequest () {
      let sr = this.state.serviceRequest;
      let driver = this.state.user;
      let mechanic = DatabaseService.getUser(sr.assignedMechanicEmail);
      let vehicle = await DatabaseService.getVehicle(sr.vehicleId);
      let result = await PaymentService.payForServiceRequest(driver, mechanic, this.state.amount, sr.id);
      if (!result.pass) {
        Toast.show({
          text: "Could not complete service request, reason: " + result.reason,
          buttonText: "Okay",
          duration: 5000,
          type: "danger",
          style: {margin: 10, marginBottom: 60, borderRadius: 15}
        });
        return;
      }
      let payment = await DatabaseService.getPayment(result.paymentId);

      // Update sr:
      sr.paymentId = result.paymentId;
      sr.status = "Completed";
      sr.completionDate = new Date();
      sr.driverComments = this.state.comments;
      sr.ratingGiven = this.state.rating;

      // Update driver and the vehicle:
      driver.serviceRequestHistory.push(sr.id);
      driver.srId = vehicle.srId = null;
      driver.paymentIds.push(result.paymentId);

      // Update mechanic:
      mechanic.serviceRequestHistory.push(sr.id);
      if (mechanic.rating === "Un-rated") mechanic.rating = this.state.rating;
      else {
        mechanic.rating += this.state.rating;
        mechanic.rating /= 2;
      }
      mechanic.srId = null;
      mechanic.earnings += payment.mechanicCut;

      await Promise.all([
        await DatabaseService.saveUserChanges(driver),
        await DatabaseService.saveUserChanges(mechanic),
        await DatabaseService.saveServiceRequestChanges(sr),
        sr.offers.map(async offer => {
          // Remove all the offers from mechanics that made one to this sr:
          let mechanic = await DatabaseService.getUser(offer.mechanicEmail);
          mechanic.offersSent = mechanic.offersSent
            .filter(srId => srId !== this.state.serviceRequest.id);
          await DatabaseService.saveUserChanges(mechanic);
        })
      ]);

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
              onValueChange={rating => this.setState({rating})}
              maximumValue={5}
              minimumValue={1}
              step={0.25}
              style={{width: "60%"}}
              ref={ref => { this.sliderInput = ref; }}
            />
          </View>
          <Item floatingLabel style={styles.centeredRowContainer}>
            <Label style={{lineHeight: 40, textAlignVertical: "top", fontSize: 20}}>Any additional comments:</Label>
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
