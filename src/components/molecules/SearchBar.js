import React from "react";
import {
  Text,
  View
} from "react-native";
import {
  Card,
  CardItem,
  Button,
  Item,
  Input,
  Icon
} from "native-base";

export default class SearchBar extends React.Component {
  render () {
    return (
      // <View style={{flex: 1, width: "100%", justifyContent: "center"}}>
      <Item rounded style={{backgroundColor: "white", height: 40}}>
        <Icon name="search"/>
        <Input
          placeholder="Search"
          onChangeText={this.props.onChangeText}
        />
      </Item>
      // </View>
    );
  }
}
