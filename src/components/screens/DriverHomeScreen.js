/*
  Screens need to be split into one screen per file. This document has about 4 screens in it (I would fix it, but I don't want to cause a merge conflict if it's being edited by someone else)
*/

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
import DatabaseService from "@lib/services/DatabaseService";
import LocationService from "@lib/services/LocationService";

// todo: add image placeholder in offerview
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
    descripton: "",
    vehicles: null,
    selectedVehicle: null,
    location: null, // latitude-longitude coordinates
    user: null
  }

  componentDidMount () {
    DatabaseService.getSignedInUser()
      .then(async user => {
        let location = await LocationService.getCurrentLocation();
        if (!location) Alert.alert("Cannot continue unless location permission is enabled.");
        let vehicles = [];
        for (let id of user.vehicleIds) {
          vehicles.push(await DatabaseService.getVehicle(id));
        }
        this.setState({
          user,
          vehicles: vehicles.length > 0 ? vehicles : null,
          location,
          selectedVehicle: vehicles.length > 0 ? vehicles[0] : null
        });
      })
      .catch(err => {
        throw err;
      });
  }

  render () {
    return (
      <View>
        <Text style={styles.heading}>Roadside Assistance Request</Text>
        {/* car selection dropdown input */}
        {!this.state.location ? null
          : <View style={styles.centeredRowContainer}>
            <Text>Your location has been automatically retrieved.</Text>
          </View>
        }
        {!this.state.vehicles
          ? <View style={styles.centeredRowContainer}>
            <Text>We found no cars tied to your account. Please go back and add one to continue.</Text>
          </View>
          : <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Car:</Text>
            <View style={{borderWidth: 1, borderRadius: 5}}>
              <Picker
                selectedValue={this.state.selectedVehicleId}
                style={{width: 150}}
                itemStyle={{fontSize: 20}}
                mode="dropdown"
                onValueChange={vehicle => this.setState({selectedVehicleId: vehicle})}>
                {this.state.vehicles.map((vehicle, index) => {
                  return <Picker.Item
                    key={index}
                    label={`${vehicle.year} ${vehicle.make}`}
                    value={vehicle}
                  />;
                })}
              </Picker>
            </View>
          </View>
        }
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
            onPress={async () => { await this._submitRequest(); }}
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
  async _submitRequest () {
    if (!this.state.descripton || !this.state.selectedVehicle) {
      Alert.alert("Please fill in description and select a vehicle.");
      return;
    }
    let result = await DatabaseService.createServiceRequest(
      this.state.location, this.state.user.email, this.state.selectedVehicle.id, this.state.descripton
    );
    if (!result.pass && !result.srId) {
      Alert.alert(result.reason);
      return;
    }
    // Save user and vehicle changes:
    let user = this.state.user;
    let vehicle = this.state.selectedVehicle;
    user.srId = vehicle.srId = result.srId;
    await Promise.all([
      DatabaseService.saveUserChanges(user),
      DatabaseService.saveVehicleChanges(vehicle)
    ]);
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
