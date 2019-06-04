import React from "react";
import {
  Image,
  Alert,
  TouchableWithoutFeedback,
  View,
  StyleSheet
} from "react-native";
import {
  Container, Header, Content, Card,
  CardItem, Thumbnail, Text, Button,
  Icon, Left, Body, Right, SwipeRow
} from "native-base";
import {month} from "@constants/common";
import StarRating from "react-native-star-rating";
import User from "@model/user";

export default class ReviewCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoading: true,
      driver: {}
    };
  }
  async componentDidMount () {
    const driver = await User.getUser({id: this.props.item.driverID});
    // console.log(driver);
    this.setState({
      driver,
      isLoading: false
    });
  }

  render () {
    // console.log(this.props.item.driverID);
    // console.log(this.state);
    const creationDate = `${this.props.item.creationDate.getUTCDay()} ${month[this.props.item.creationDate.getUTCMonth()]} ${this.props.item.creationDate.getUTCFullYear()}`;

    return (
      <TouchableWithoutFeedback>
        <Card style={{width: "100%"}}>
          {!this.state.isLoading &&
        <CardItem>
          <Left>
            <Thumbnail circle large
              source={ this.state.driver.pictureURI
                ? {uri: this.state.driver.pictureURI}
                : require("@assets/images/placeholder-user.png")}
              style={styles.userImage}
            />
            <Body>
              <Text>{this.state.driver.fullName}</Text>
              <Text note>{this.props.item.comment}</Text>
              <View style={{paddingTop: 8, width: 110}}><StarRating
                disabled={true}
                maxStars={5}
                rating={this.props.item.value / 2}
                iconSet="Ionicons"
                emptyStar="ios-star-outline"
                halfStar="ios-star-half"
                fullStar="ios-star"
                starSize={20}
              /></View>
              <Text note>{creationDate}</Text>
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
  userImage: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
    resizeMode: "cover",
  },
});
