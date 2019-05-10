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
export default class VehicleCard extends React.Component {
  render () {
    return (
      <TouchableWithoutFeedback onPress={() => Alert.alert(`You pressed car number ${this.props.index}`)}>
        <Card style={{width: "100%"}}>
          <CardItem>
            <Left>
              <Thumbnail square large source={{uri: "https://appleton.wi-autosales.com/wp-content/themes/car-dealer-deluxe/assets/images/product-images/placeholder_car.png"}}/>
              <Body>
                <Text>Custom Name</Text>
                <Text note>Year Make Model</Text>
                <Text note>Plate</Text>
                <Text note>Added on</Text>
              </Body>
            </Left>
          </CardItem>
        </Card>
      </TouchableWithoutFeedback>
    );
  }
}
