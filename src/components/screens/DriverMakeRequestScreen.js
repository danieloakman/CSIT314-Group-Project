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

import DriverHomeScreen from "@components/screens/DriverHomeScreen";

export default class RequestScreen extends React.Component {
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
              onPress={() => this.props.navigation.navigate(DriverHomeScreen)}
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
      this.props.navigation.navigate(DriverHomeScreen);
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
  }
});
