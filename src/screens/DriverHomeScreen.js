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
  // TouchableOpacity,
  // Colors
} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
// todo: make buttons work, fix description input (hard to close, making too many lines makes box too big)
/*
multiline = {true}
numberOfLines = {3}
*/
class DriverHomeScreen extends React.Component {
  render () {
    /* const {navigate} = this.props.navigation; */
    return (
      <View>
        <Text style={styles.heading}>Home</Text>
        <View style={styles.buttons}>
          <Button
            title="Request Assistance"
            onPress={() => this.props.navigation.navigate("Request") }
          />
        </View>
      </View>
    );
  }
}

class RequestScreen extends React.Component {
  state = {
    address: "",
    suburb: "",
    descripton: "",
    selectedState: "NSW",
    car: "car 1"
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Roadside Assistance Request</Text>
        {/* Address text input */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Address:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="123 street name"
            onChangeText={address => this.setState({ address })}
          />
        </View>
        {/* Suburb text input */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Suburb:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={suburb => this.setState({ suburb })}
          />
        </View>
        {/* State dropdown input */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>State:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.selectedState}
              style={{width: 150}}
              itemStyle={{fontSize: 20}}
              mode="dropdown"
              onValueChange={selectedState => this.setState({ selectedState })}
            >
              <Picker.Item label="NSW" value="NSW" />
              <Picker.Item label="VIC" value="VIC" />
              <Picker.Item label="QLD" value="QLD" />
              <Picker.Item label="WA" value="WA" />
              <Picker.Item label="SA" value="SA" />
              <Picker.Item label="NT" value="NT" />
              <Picker.Item label="ACT" value="ACT" />
            </Picker>
          </View>
        </View>
        {/* GPS button */}
        <View style={styles.buttons}>
          <Button
            title="Use GPS Location"
            onPress={() => Alert.alert("not implemented yet")}
            /* NOTE: for google maps integration */
            /* can probably remove address, suburb, state if using GPS/google maps instead */
          />
        </View>
        {/* car selection dropdown input */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>State:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.car}
              style={{width: 150}}
              itemStyle={{fontSize: 20}}
              mode="dropdown"
              onValueChange={car => this.setState({ car })}>
              <Picker.Item label="car 1" value="car 1" />
              <Picker.Item label="car 2" value="car 2" />
              <Picker.Item label="car 3" value="car 3" />
            </Picker>
          </View>
        </View>
        {/* Description text input */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Description:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={descripton => this.setState({ descripton })}
          />
        </View>
        {/* Submit Button */}
        <View style={styles.buttons}>
          <Button
            style="buttons"
            title="Submit"
            onPress={() => this._showInputFields()}
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
  _showInputFields () {
    Alert.alert(
      "Address: " + this.state.address +
      "\nSuburb: " + this.state.suburb +
      "\nState: " + this.state.selectedState +
      "\nDescription: " + this.state.descripton +
      "\nCar: " + this.state.car
    );
    this.props.navigation.navigate("OfferList");
  }
}

// offers screen
class OfferList extends React.Component {
  state = {
    sorting: "Rating",
    waitTime: "20min",
    cost: "$200",
    mechanic: "Joe White",
    rating: "4.2"
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
              <Picker.Item label="Rating" value="Rating" />
              <Picker.Item label="Cost" value="Cost" />
              <Picker.Item label="Time" value="Time" />
              <Picker.Item label="Name" value="Name" />
            </Picker>
          </View>
        </View>
        {/* offer display box, will be a list of these here, should say no offers yet if empty */}
        <TouchableOpacity style={styles.buttonBox} onPress={() => this._selectOffer()}>
          <View style={styles.buttonBoxText}>
            <Text>Time: {this.state.waitTime}</Text>
            <Text>Cost: {this.state.cost}</Text>
            <Text>Mechnanic: {this.state.mechanic}</Text>
            <Text>Average Rating: {this.state.rating}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.buttons}>
          <Button
            title="Cancel Request"
            onPress={() => this.props.navigation.popToTop()}
          />
        </View>
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
  _selectOffer () {
    this.props.navigation.navigate("OfferView", {
      waitTime: this.state.waitTime,
      cost: this.state.cost,
      mechanic: this.state.mechanic,
      rating: this.state.rating });
  }
}

class OfferView extends React.Component {
  render () {
  /* get parameters from the list item which was clicked */
    const { navigation } = this.props;
    const waitTime = navigation.getParam("waitTime", "mechanic ETA");
    const cost = navigation.getParam("cost", "mechanic service fee");
    const mechanic = navigation.getParam("mechanic", "mechanics name");
    const rating = navigation.getParam("rating", "mechnaic average rating");
    return (
      <View>
        <Text style={styles.heading}>Offer</Text>
        <View style={styles.buttonBoxText}>
          <Text>Time: {waitTime}</Text>
          <Text>Cost: {cost}</Text>
          <Text>Mechnanic: {mechanic}</Text>
          <Text>Average Rating: {rating}</Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title="View Mechanic Profile"
            onPress={() => Alert.alert("go to mechanic profile view")}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Accept Request"
            onPress={() => Alert.alert("request accepted...")}
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
    Home: DriverHomeScreen,
    Request: RequestScreen,
    OfferList: OfferList,
    OfferView: OfferView
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
