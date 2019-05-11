import React from "react";
import {
  Text,
  View,
  FlatList
} from "react-native";
import {
  Card,
  CardItem,
  Button
} from "native-base";
import { withNavigation } from "react-navigation";
import HeaderBar from "@molecules/HeaderBar";
import SearchBar from "@molecules/SearchBar";

import _ from "lodash";

class SearchScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      results: []
    };
  }

  _search (query) {
    console.log(`Search: ${query}`);
    // Search function goes here and should set results state
    // Need proper DB in order to actually search
  }

  render () {
    this._deSearch = _.debounce(this._search.bind(this), 500, {maxWait: 1000});
    return (
      <View>
        <HeaderBar
          navMid={
            <SearchBar
              onChangeText={this._deSearch.bind(this)}
            />
          }
        />
        <FlatList
          data={this.state.results}
          renderItem={({item, index}) => <Card><CardItem><Text>Search result # {index}</Text></CardItem></Card>}
          ListEmptyComponent={() => <Text style={{color: "lightgrey", fontWeight: "bold", fontSize: 16, textAlign: "center", paddingTop: 20}}>Try searching for something</Text>}
        />
      </View>
    );
  }
}

export default withNavigation(SearchScreen);
