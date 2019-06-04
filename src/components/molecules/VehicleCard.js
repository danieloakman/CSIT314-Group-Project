import React from "react";
import {
  Image,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import {
  Container, Header, Content, Card,
  CardItem, Thumbnail, Text, Button,
  Icon, Left, Body, Right, SwipeRow
} from "native-base";
import {month} from "@constants/common";

export default class VehicleCard extends React.Component {
  render () {
    const {year, make, model} = this.props.item;
    const creationDate = `${this.props.item.creationDate.getUTCDay()} ${month[this.props.item.creationDate.getUTCMonth()]} ${this.props.item.creationDate.getUTCFullYear()}`;

    return (
      <TouchableWithoutFeedback onPress={() => Alert.alert(`You pressed car number ${this.props.index}`)}>
        <Card style={{width: "100%"}}>
          <CardItem>
            <Left>
              <Thumbnail square large source={{uri: this.props.item.imageURI ? this.props.item.imageURI : "https://appleton.wi-autosales.com/wp-content/themes/car-dealer-deluxe/assets/images/product-images/placeholder_car.png"}}/>
              <Body>
                {/* <Text>{this.props.item.customName}</Text> */}
                <Text>{year} {make} {model}</Text>
                <Text note>{this.props.item.plate}</Text>
                <Text note>Added on {creationDate}</Text>
              </Body>
            </Left>
          </CardItem>
        </Card>
      </TouchableWithoutFeedback>
    );
  }
}
