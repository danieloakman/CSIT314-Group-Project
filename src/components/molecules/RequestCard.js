import React from "react";
import {
  Image,
  Alert,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import {
  Container, Header, Content, Card,
  CardItem, Thumbnail, Text, Button,
  Icon, Left, Body, Right, SwipeRow
} from "native-base";
import {month} from "@constants/common";

import User from "@model/user";
import Offer from "@model/Offer";
import Vehicle from "@model/Vehicle";

/**
 * Shows: date, time, vehicle name, mechanic, cost
 * Loads: vehicle, offer, mechanic
 */
export default class VehicleCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoading: true,
      mechanic: {},
      vehicle: {},
      offer: {}
    };
  }

  async componentDidMount () {
    const vehicle = await Vehicle.getVehicle(this.props.item.vehicleID);
    const offer = await Offer.getOffer(this.props.item.selectedOfferID);
    const mechanic = await User.getUser({id: offer.mechanicID});
    this.setState({
      vehicle,
      offer,
      mechanic,
      isLoading: false
    });
  }

  render () {
    // const {year, make, model} = this.props.item;
    const creationDate = `${this.props.item.creationDate.getUTCDay()} ${month[this.props.item.creationDate.getUTCMonth()]} ${this.props.item.creationDate.getUTCFullYear()}`;

    return (
      <TouchableWithoutFeedback onPress={() => Alert.alert(`You pressed car number ${this.props.index}`)}>
        <Card style={{width: "100%"}}>
          {!this.state.isLoading &&
            <CardItem>
              <Left>
                <Thumbnail circle large
                  source={ this.state.vehicle.imageURI
                    ? {uri: this.state.vehicle.imageURI}
                    : require("@assets/images/placeholder-vehicle.png")}
                  style={styles.vehicleImage}
                />
                <Body>
                  <Text>{creationDate} <Text note>{this.props.item.creationDate.toLocaleTimeString()}</Text></Text>
                  <Text note>{this.state.vehicle.year} {this.state.vehicle.make} {this.state.vehicle.model} - {this.state.vehicle.plate}</Text>
                  <Text note>Serving Mechanic: {this.state.mechanic.fullName}</Text>
                  <Text note>Cost: ${this.state.offer.cost}</Text>

                </Body>
              </Left>
            </CardItem>
          }
        </Card>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  vehicleImage: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
    resizeMode: "cover",
  },
});
