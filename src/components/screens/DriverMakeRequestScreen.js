import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Picker,
  ScrollView
} from "react-native";
import {
  Toast,
  Item,
  Label,
  Input,
} from "native-base";
// import DatabaseService from "@lib/services/DatabaseService";
import LocationService from "@lib/services/LocationService";
import LoadingGif from "@components/atoms/LoadingGif";
import Problems from "@constants/CommonFaults";
import HeaderBar from "@molecules/HeaderBar";

import Vehicle from "@model/Vehicle";
import Request from "@model/Request";

export default class RequestScreen extends React.Component {
    state = {
      description: "Other",
      vehicles: [],
      selectedVehicle: null,
      location: null, // latitude-longitude coordinates
      user: null,
      isLoading: true
    }

    componentDidMount () {
      let user = this.props.navigation.getParam("user");
      new Promise(async resolve => {
        let vehicles = await Promise.all(
          user.vehicles.map(async id => Vehicle.getVehicle(id))
        );
        let location;
        if (!user.location) {
        // Retrieve the user's location if it doesn't exist:
          location = await LocationService.getCurrentLocation();
        } else if (user.location.timestamp >= Date.now() - 2 * 60 * 1000) {
        // Only use the user's location if it is less than 2 hours old:
          location = user.location;
        } else {
        // Retrieve the user's location:
          location = await LocationService.getCurrentLocation();
        }
        if (!location) {
          Toast.show({
            text: "Cannot continue unless location permission is enabled.",
            buttonText: "Okay",
            duration: 5000,
            type: "danger",
            style: {margin: 10, borderRadius: 15}
          });
        } else {
          if (!location.address) {
            let address = await LocationService.getAddress(
              location.coords.latitude, location.coords.longitude
            );
            location.address = address ? address.addressStr : "Address unavailable";
            // user.location = location;
            // await DatabaseService.saveUserChanges(user);
            location.title = "Current Location";
            await user.setLocation(location);
          }
        }
        this.setState({
          user,
          vehicles: vehicles.length > 0 ? vehicles : null,
          location,
          selectedVehicle: vehicles.length > 0 ? 0 : null,
          isLoading: false
        });
        resolve(true);
      });
    }

    render () {
      return (
        <View>
          <ScrollView>
            <HeaderBar
              navLeft={this.state.isLoading ? <View/> : null}
              title="Roadside Assistance Request"
            />
            {/* car selection dropdown input */}
            {this.state.isLoading
              ? <View style={styles.centeredRowContainer}>
                <Text style={{fontSize: 15}}>Fetching your current location... </Text>
                <LoadingGif imageStyle={{width: 25, height: 25, alignSelf: "flex-start"}} />
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
                <LoadingGif imageStyle={{width: 25, height: 25, alignSelf: "flex-start"}} />
              </View>
              : !this.state.vehicles
                ? <View style={styles.centeredRowContainer}>
                  <Text style={{fontSize: 15}}>We found no cars tied to your account. Please go back and add one to continue.</Text>
                </View>
                : <View style={styles.centeredRowContainer}>
                  <Text style={styles.textBesideInput}>Car:</Text>
                  <View style={{borderWidth: 1, borderRadius: 5}}>
                    <Picker
                      selectedValue={this.state.vehicles[this.state.selectedVehicle]}
                      style={{width: 200}}
                      itemStyle={{fontSize: 20}}
                      mode="dropdown"
                      onValueChange={(vehicle, pos) => this.setState({selectedVehicle: pos})}>
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
              : <Item floatingLabel style={styles.centeredRowContainer}>
                <Label style={{lineHeight: 40, textAlignVertical: "top", fontSize: 20}}>Your description</Label>
                <Input multiline style={{paddingTop: 20, fontSize: 20}}
                  onChangeText={description => this.setState({ description })}
                />
              </Item>
            }
            {/* Create Request Button */}
            <View style={styles.buttons}>
              <Button
                style="buttons"
                title="Create Request"
                onPress={async () => { await this._submitRequest(); }}
                disabled={this.state.isLoading}
              />
            </View>
          </ScrollView>
        </View>
      );
    }
    async _submitRequest () {
      if (!this.state.description || typeof this.state.selectedVehicle !== "number") {
        Toast.show({
          text: "Please fill in description and select a vehicle.",
          buttonText: "Okay",
          duration: 5000,
          type: "warning",
          style: {margin: 10, marginBottom: 60, borderRadius: 15}
        });
        return;
      }
      let result = await Request.createServiceRequest(
        this.state.location, this.state.user.id, this.state.vehicles[this.state.selectedVehicle].id, this.state.description
      );
      if (!result.ok && !result.id) {
        Toast.show({
          text: result.reason,
          buttonText: "Okay",
          duration: 5000,
          type: "danger",
          style: {margin: 10, marginBottom: 60, borderRadius: 15}
        });
        return;
      }
      await this.state.user.setActiveRequest(result.id);
      Toast.show({
        text: "Created assistance request! New offers will appear momentarily.",
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "center"
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
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 5,
    width: "60%",
    paddingLeft: 5,
    backgroundColor: "white"
  },
});
