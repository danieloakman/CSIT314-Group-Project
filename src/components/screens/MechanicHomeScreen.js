import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
  Picker
} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
// todo:
class MechanicHomeScreen extends React.Component {
  render () {
    return (
      <View>
        <Text style={styles.heading}>Home</Text>
        <View style={styles.buttons}>
          <Button
            title="View Nearby Requests"
            onPress={() => this.props.navigation.navigate("RequestList") }
          />
        </View>
      </View>
    );
  }
}

// request list
class RequestList extends React.Component {
  state = {
    distance: "20km",
    time: "20min",
    description: "Flat Tyre"
  }
  render () {
    return (
      <ScrollView>
        <Text style={styles.heading}>Offers</Text>
        {/* sort by dropdown */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Sort By:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.sorting}
              style={{width: 150}}
              itemStyle={{fontSize: 20}}
              mode="dropdown"
              onValueChange={sorting => this.setState({ sorting })}>
              <Picker.Item label="Distance" value="distance" />
              <Picker.Item label="Time" value="time" />
              <Picker.Item label="Description" value="description" />
            </Picker>
          </View>
        </View>
        {/* Request display box, will be a list of these here, should say no nearby requests if empty */}
        <TouchableOpacity style={styles.buttonBox} onPress={() => this._makeOffer()}>
          <View style={styles.buttonBoxText}>
            <Text>Distance: {this.state.distance}</Text>
            <Text>Time: {this.state.time}</Text>
            <Text>Description: {this.state.description}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </ScrollView>
    );
  }
  /* Note will need to set states first depending on what was clicked */
  _makeOffer () {
    this.props.navigation.navigate("RequestView", {
      distance: this.state.distance,
      time: this.state.time,
      description: this.state.description });
  }
}

class RequestView extends React.Component {
  state = {
    offerAmount: "500"
  }
  render () {
  /* get parameters from the list item which was clicked */
    const { navigation } = this.props;
    const distance = navigation.getParam("distance", "distance from current location");
    const time = navigation.getParam("time", "time it will take to travel there");
    const description = navigation.getParam("description", "problem description of car");
    return (
      <View>
        <Text style={styles.heading}>Request</Text>
        <View style={styles.buttonBoxText}>
          <Text>Distance: {distance}</Text>
          <Text>Time: {time}</Text>
          <Text>Description: {description}</Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title="View Driver Profile"
            onPress={() => Alert.alert("go to driver profile view")}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Offer Amount: $</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={offerAmount => this.setState({ offerAmount })}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Make Offer"
            onPress={() => Alert.alert("offer made...")}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
}

const MainNavigator = createStackNavigator(
  {
    Home: MechanicHomeScreen,
    RequestList: RequestList,
    RequestView: RequestView
  },
  {
    initialRouteName: "Home",
    /* header stuff (used for all these screens) */
    defaultNavigationOptions: {
      header: null
    }
  }
);
const AppContainer = createAppContainer(MainNavigator);
export default class App extends React.Component {
  render () {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "center"
  },
  background: {
    backgroundColor: "black",
    width: 100,
    height: 100
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
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 5,
    width: "60%",
    paddingLeft: 5,
    backgroundColor: "white"
  },
  wideButtonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  wideButton: {
    // backgroundColor: Colors.wideButton,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5
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
  },
  textBox: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 5,
    width: "90%",
    paddingLeft: 5,
    backgroundColor: "white",
    marginBottom: 5,
    alignSelf: "center"
  },
  buttonBox: {
    alignSelf: "center",
    backgroundColor: "yellow",
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 2,
    marginBottom: 2
  },
  buttonBoxText: {
    justifyContent: "center",
    padding: 10,
    fontSize: 20
  }
});
