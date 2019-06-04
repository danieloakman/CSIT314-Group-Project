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

export default class VehicleCard extends React.Component {
  render () {
    const {year, make, model} = this.props.item;
    const creationDate = `${this.props.item.creationDate.getUTCDay()} ${month[this.props.item.creationDate.getUTCMonth()]} ${this.props.item.creationDate.getUTCFullYear()}`;

    return (
      <TouchableWithoutFeedback>
        <Card style={{width: "100%"}}>
          <CardItem>
            <Left>
              <Thumbnail circle large
                source={ this.props.item.imageURI
                  ? {uri: this.props.item.imageURI}
                  : require("@assets/images/placeholder-vehicle.png")}
                style={styles.vehicleImage}
              />
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

const styles = StyleSheet.create({
  vehicleImage: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
    resizeMode: "cover",
  },
});
