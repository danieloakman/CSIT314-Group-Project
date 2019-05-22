/*
  Screens need to be split into one screen per file. This document has about 4 screens in it (I would fix it, but I don't want to cause a merge conflict if it's being edited by someone else)
*/

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Picker,
  Slider,
  Keyboard
} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
import {
  Toast,
  Textarea
} from "native-base";
import DatabaseService from "@lib/services/DatabaseService";
import LocationService from "@lib/services/LocationService";
import GMapView from "@components/GoogleMapView";
import {MapView} from "expo";
import WindowBox from "@components/WindowBox";
import LoadingGif from "@components/atoms/LoadingGif";
import Problems from "@constants/CommonFaults";

import MechanicProfileViewScreen from "@screens/MechanicProfileViewScreen";
class DriverHomeScreen extends React.Component {
  state = {
    user: null,
    serviceRequest: null,
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
            serviceRequest: sr,
            enableRequestAssistance: !user.srId,
            enableViewCurrentOffers: user.srId && sr ? sr.status === "Awaiting offer acceptance" : false,
            enableViewActiveRequest: user.srId && sr ? sr.status === "Offer accepted" : false
          });
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
              onPress={() => {
                this.props.navigation.navigate(
                  "ActiveServiceRequest",
                  {
                    user: this.state.user,
                    serviceRequest: this.state.serviceRequest
                  }
                );
              }}
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
    description: "Other",
    vehicles: null,
    selectedVehicle: null,
    location: null, // latitude-longitude coordinates
    user: null,
    isLoading: true
  }

  componentDidMount () {
    LocationService.getCurrentLocation()
      .then(async location => {
        let user = this.props.navigation.getParam("user", "The current user");
        if (!location) {
          Toast.show({
            text: "Cannot continue unless location permission is enabled.",
            duration: 5000,
            type: "danger",
            style: {margin: 10, borderRadius: 15}
          });
        }
        let vehicles = [];
        for (let id of user.vehicleIds) {
          vehicles.push(await DatabaseService.getVehicle(id));
        }
        this.setState({
          user,
          vehicles: vehicles.length > 0 ? vehicles : null,
          location,
          selectedVehicle: vehicles.length > 0 ? vehicles[0] : null,
          isLoading: false
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
        {this.state.isLoading
          ? <View style={styles.centeredRowContainer}>
            <Text style={{fontSize: 15}}>Fetching your current location... </Text>
            <LoadingGif style={{width: 25, height: 25, alignSelf: "flex-start"}} />
          </View>
          : !this.state.location
            ? <View style={styles.centeredRowContainer}>
              <Text style={{fontSize: 15}}>Your location was not retrieved successfully.</Text>
            </View>
            : <View style={styles.centeredRowContainer}>
              <Text style={{fontSize: 15}}>Your location has been automatically retrieved.</Text>
            </View>
        }
        {this.state.isLoading
          ? <View style={styles.centeredRowContainer}>
            <Text style={{fontSize: 15}}>Loading your list of cars... </Text>
            <LoadingGif style={{width: 25, height: 25, alignSelf: "flex-start"}} />
          </View>
          : !this.state.vehicles
            ? <View style={styles.centeredRowContainer}>
              <Text style={{fontSize: 15}}>We found no cars tied to your account. Please go back and add one to continue.</Text>
            </View>
            : <View style={styles.centeredRowContainer}>
              <Text style={styles.textBesideInput}>Car:</Text>
              <View style={{borderWidth: 1, borderRadius: 5}}>
                <Picker
                  selectedValue={this.state.selectedVehicleId}
                  style={{width: 200}}
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
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Description of Fault:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={Problems.includes(this.state.description) ? this.state.description : "Other"}
              style={{ width: 150 }}
              itemStyle={{ fontSize: 20 }}
              onValueChange={description => this.setState({ description })}>
              {Problems.map((descriptionValue, index) => {
                return <Picker.Item key={index} label={descriptionValue.toString()} value={descriptionValue}/>;
              })}
              <Picker.Item label="Other" value="Other"/>
            </Picker>
          </View>
        </View>
        {/* Description text input, disable unless 'Other' is selected because that's not in the Problems array. */}
        {Problems.includes(this.state.description) ? null
          : <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Your description:</Text>
            <TextInput
              style={[styles.textInput, {width: "55%"}]} // todo: Should probably make a multi-line text input here
              onChangeText={description => this.setState({ description })}
              onSubmitEditing={async () => { await this._submitRequest(); }}
              disabled={this.state.isLoading}
            />
          </View>
        }
        {/* Submit Button */}
        <View style={styles.buttons}>
          <Button
            style="buttons"
            title="Submit"
            onPress={async () => { await this._submitRequest(); }}
            disabled={this.state.isLoading}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
            disabled={this.state.isLoading}
          />
        </View>
      </View>

    );
  }
  async _submitRequest () {
    if (!this.state.description || !this.state.selectedVehicle) {
      Toast.show({
        text: "Please fill in description and select a vehicle.",
        duration: 5000,
        type: "warning",
        style: {margin: 10, borderRadius: 15}
      });
      return;
    }
    let result = await DatabaseService.createServiceRequest(
      this.state.location, this.state.user.email, this.state.selectedVehicle.id, this.state.description
    );
    if (!result.pass && !result.srId) {
      Toast.show({
        text: result.reason,
        duration: 5000,
        type: "danger",
        style: {margin: 10, borderRadius: 15}
      });
      return;
    }
    // Save user and vehicle changes:
    let user = this.state.user;
    let vehicle = JSON.parse(JSON.stringify(this.state.selectedVehicle));
    user.srId = vehicle.srId = result.srId;
    await Promise.all([
      DatabaseService.saveUserChanges(user),
      DatabaseService.saveVehicleChanges(vehicle)
    ]);
    Toast.show({
      text: "Created assistance request! New offers will appear momentarily.",
      duration: 5000,
      type: "success",
      style: {margin: 10, borderRadius: 15}
    });
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
    maxRadius: 50
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
                const rating = !isNaN(parseFloat(offer.mechanicRating))
                  ? offer.mechanicRating + "/5"
                  : offer.mechanicRating;
                return <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude: offer.location.coords.latitude,
                    longitude: offer.location.coords.longitude
                  }}
                  title={`$${offer.offerAmount}, Rating: ${rating}`}
                  description={`Distance: ${Math.floor(distance * 100) / 100}km`}
                  onPress={() => {
                    this.setState({selectedOffer: offer});
                  }}
                />;
              })}
          </GMapView>
        </View>
        <Text style={styles.heading}>Offers</Text>
        {/* max radius dropdown */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Max Radius:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.maxRadius}
              style={{ width: 150 }}
              itemStyle={{ fontSize: 20 }}
              mode="dropdown"
              onValueChange={maxRadius => this.setState({ maxRadius })}>
              {[25, 50, 100, 150, 200].map((radiusValue, index) => {
                return <Picker.Item key={index} label={radiusValue.toString()} value={radiusValue}/>;
              })}
            </Picker>
          </View>
        </View>
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
            onPress={async () => {
              let user = this.state.user;
              let vehicle = await DatabaseService.getVehicle(this.state.serviceRequest.vehicleId);
              user.srId = vehicle.srId = null;
              await Promise.all([
                DatabaseService.saveUserChanges(user),
                DatabaseService.saveVehicleChanges(vehicle),
                DatabaseService.deleteServiceRequest(this.state.serviceRequest.id),
                this.state.serviceRequest.offers.map(async offer => {
                  let mechanic = await DatabaseService.getUser(offer.mechanicEmail);
                  mechanic.offersSent = mechanic.offersSent
                    .filter(srId => srId !== this.state.serviceRequest.id);
                  await DatabaseService.saveUserChanges(mechanic);
                })
              ]);
              this.props.navigation.popToTop();
            }}
            disabled={this.state.isLoadingMap}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
            disabled={this.state.isLoadingMap}
          />
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
    Toast.show({
      text: "Offer accepted!",
      duration: 5000,
      type: "success",
      style: {margin: 10, borderRadius: 15}
    });
    this.props.navigation.navigate("Home");
  }
}

class ActiveServiceRequest extends React.Component {
  state = {
    user: null,
    serviceRequest: null,
    rating: 5,
    comments: "",
    isLoading: true
  }

  componentDidMount () {
    this.setState({
      user: this.props.navigation.getParam("user", "Currently signed in driver"),
      serviceRequest: this.props.navigation.getParam("serviceRequest")
    });
  }

  async _completeServiceRequest () {
    // todo: await DatabaseService.createPayment();
    Toast.show({
      text: "Completed service request!",
      duration: 5000,
      type: "success",
      style: {margin: 10, borderRadius: 15}
    });
    this.props.navigation.goBack();
  }

  async _cancelOffer () {
    Toast.show({
      text: "Cancelled assistance, please choose an another offer.",
      duration: 5000,
      type: "warning",
      style: {margin: 10, borderRadius: 15}
    });
    this.props.navigation.goBack();
  }

  render () {
    return (
      <WindowBox>
        <Text style={styles.heading}>Active Request</Text>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Rating: {this.state.rating}/5</Text>
          <Slider
            value={this.state.rating}
            onValueChange={rating => this.setState({rating})}
            maximumValue={5}
            minimumValue={1}
            step={0.25}
            style={{width: "60%"}}
            ref={ref => { this.sliderInput = ref; }}
          />
        </View>
        <Textarea
          bordered
          rowSpan={4}
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 10,
            fontSize: 20
          }}
          placeholder="Any additional comments."
          onChangeText={comments => this.setState({comments})}
          onSubmitEditing={Keyboard.dismiss}
        />
        <View style={styles.buttons}>
          <Button
            title="Complete Assisstance Request"
            onPress={async () => {
              await this._completeServiceRequest();
            }}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Cancel assisstance and re-choose another offer"
            onPress={async () => {
              await this._cancelOffer();
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
