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
import GMapView from "@components/GoogleMapView";
import {MapView} from "expo";
import WindowBox from "@components/WindowBox";

import MechanicProfileViewScreen from "@screens/MechanicProfileViewScreen";
// todo:
class DriverHomeScreen extends React.Component {
  state = {
    user: null,
    enableRequestAssistance: false,
    enableViewCurrentOffers: false,
    enableViewActiveRequest: false,
  }

  componentDidMount () {
    const {navigation} = this.props;
    navigation.addListener("willFocus", () => { // todo: maybe make a better refresh screen method
      DatabaseService.getSignedInUser()
        .then(async user => {
          let sr = await DatabaseService.getServiceRequest(user.srId);
          this.setState({
            user,
            enableRequestAssistance: !user.srId,
            enableViewCurrentOffers: user.srId && sr ? sr.status === "Awaiting offer acceptance" : false,
            enableViewActiveRequest: user.srId && sr ? sr.status === "Offer accepted" : false
          });
          // console.log(this.state.userHasAnSR, this.state.anOfferIsAccepted);
        })
        .catch(err => { throw err; });
    });
  }

  render () {
    return (
      <View>
        <Text style={styles.heading}>Home</Text>
        <View style={styles.buttons}>
          {!this.state.user ? null
            : <Button
              title="Request Assistance"
              onPress={() => this.props.navigation.navigate("Request", {user: this.state.user})}
              disabled={!this.state.enableRequestAssistance}
            />
          }
        </View>
        <View style={styles.buttons}>
          {!this.state.user ? null
            : <Button
              title="View Current Offers"
              onPress={() => this.props.navigation.navigate("OfferList", {user: this.state.user})}
              disabled={!this.state.enableViewCurrentOffers}
            />
          }
        </View>
        <View style={styles.buttons}>
          {!this.state.user ? null
            : <Button
              title="View Active Assistance Request"
              onPress={() => this.props.navigation.navigate("ActiveServiceRequest", {user: this.state.user})}
              disabled={!this.state.enableViewActiveRequest}
            />
          }
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
    LocationService.getCurrentLocation()
      .then(async location => {
        let user = this.props.navigation.getParam("user", "The current user");
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
    this.props.navigation.goBack();
  }
}

// offers screen
class OfferList extends React.Component {
  state = {
    user: null,
    serviceRequest: null,
    location: null,
    isLoadingMap: true,
    selectedOffer: null,
    sorting: "Rating",
    waitTime: "20min",
    cost: "$200",
    mechanic: "Joe White",
    rating: "4.2"
  }

  componentDidMount () {
    let user = this.props.navigation.getParam("user", "The current user");
    this.setState({user});
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <GMapView
            onLocationRetrieved={async currentLocation => {
              this.setState({
                serviceRequest: await DatabaseService.getServiceRequest(this.state.user.srId),
                isLoadingMap: false,
                location: currentLocation
              });
            }}
          >
            {this.state.isLoadingMap ? null
              : this.state.serviceRequest.offers.map((offer, index) => {
                const distance = LocationService.getDistanceBetween(offer.location.coords, this.state.location.coords);
                return <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude: offer.location.coords.latitude,
                    longitude: offer.location.coords.longitude
                  }}
                  title={`$${offer.offerAmount}, Rating: ${offer.mechanicRating}/5`}
                  description={`Distance: ${Math.floor(distance * 100) / 100}km`}
                  onPress={() => {
                    this.setState({selectedOffer: offer});
                  }}
                />;
              })}
          </GMapView>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.heading}>Offers</Text>
          {/* sort by dropdown
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
          */}
          {!this.state.selectedOffer ? null
            : <TouchableOpacity style={styles.buttonBox} onPress={() => this._selectOffer()}>
              <View style={styles.buttonBoxText}>
                {/* <Text>Time: {this.state.waitTime}</Text> // todo calculate waitTime */}
                <Text>Cost: {this.state.selectedOffer.offerAmount}</Text>
                <Text>Mechnanic: {this.state.selectedOffer.mechanicEmail}</Text>
                <Text>Average Rating: {this.state.selectedOffer.mechanicRating}</Text>
                <Text>Time when offered: {this.state.selectedOffer.creationDate}</Text>
              </View>
            </TouchableOpacity>
          }
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
        </View>
      </View>
    );
  }
  /* Note will need to set states first depending on what was clicked */
  _selectOffer () {
    this.props.navigation.navigate("OfferView", {
      offer: this.state.selectedOffer,
      user: this.state.user,
      serviceRequest: this.state.serviceRequest
    });
  }
}

class OfferView extends React.Component {
  state = {
    user: null,
    offer: null,
    serviceRequest: null
  }

  componentWillMount () {
    /* get parameters from the list item which was clicked */
    this.setState({
      offer: this.props.navigation.getParam("offer", "The selected offer"),
      user: this.props.navigation.getParam("user", "Currently signed in driver"),
      serviceRequest: this.props.navigation.getParam("serviceRequest", "The driver's service request"),
    });
  }

  render () {
    return (
      <View>
        <Text style={styles.heading}>Offer</Text>
        <View style={styles.buttonBoxText}>
          {/* <Text>Time: {waitTime}</Text> */}
          <Text>Cost: {this.state.offer.offerAmount}</Text>
          <Text>Mechnanic: {this.state.offer.mechanicEmail}</Text>
          <Text>Average Rating: {this.state.offer.mechanicRating}</Text>
          <Text>Time when offered: {this.state.offer.creationDate}</Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title="View Mechanic Profile"
            onPress={() => this.navigation.navigate("MechanicProfileView")}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Accept Request"
            onPress={async () => {
              await this._acceptRequest();
            }}
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
  async _acceptRequest () {
    await Promise.all([
      new Promise(async resolve => {
        // Update the service request:
        let sr = this.state.serviceRequest;
        sr.assignedMechanicEmail = this.state.offer.mechanicEmail;
        sr.status = "Offer accepted";
        await DatabaseService.saveServiceRequestChanges(sr);
        resolve(true);
      }),
      new Promise(async resolve => {
        // Update the mechanic:
        let mechanic = await DatabaseService.getUser(this.state.offer.mechanicEmail);
        mechanic.srId = this.state.serviceRequest.id;
        mechanic.offersSent = mechanic.offersSent
          .filter(srId => srId !== this.state.serviceRequest.id);
        await DatabaseService.saveUserChanges(mechanic);
        resolve(true);
      })
    ]);
    Alert.alert("Offer accepted!");
    this.props.navigation.navigate("Home");
  }
}

class ActiveServiceRequest extends React.Component {
  state = {
    user: null,
    rating: 5
  }

  componentDidMount () {
    this.setState({
      user: this.props.navigation.getParam("user", "Currently signed in driver"),
    });
  }

  async _completeServiceRequest () {
    //
  }

  render () {
    return ( // todo: fill out this screen.
      <WindowBox>
        <Text style={styles.heading}>Active Request</Text>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Rating:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.rating}
              style={{ width: 150 }}
              itemStyle={{ fontSize: 20 }}
              mode="dropdown"
              onValueChange={rating => this.setState({ rating })}>
              {[1, 2, 3, 4, 5].map((ratingValue, index) => {
                return <Picker.Item key={index} label={ratingValue.toString()} value={ratingValue}/>;
              })}
            </Picker>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            title="Complete Assisstance Request"
            onPress={async () => {
              // await this._completeServiceRequest();
              Alert.alert("Completed Assistance Request!");
            }}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </WindowBox>
    );
  }
}

const MainNavigator = createStackNavigator(
  {
    Home: DriverHomeScreen,
    Request: RequestScreen,
    OfferList: OfferList,
    OfferView: OfferView,
    ActiveServiceRequest,
    MechanicProfileView: MechanicProfileViewScreen
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
