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

import ViewOfferScreen from "@components/screens/DriverViewOfferScreen";
import DriverHomeScreen from "@components/screens/DriverHomeScreen";

export default class OfferList extends React.Component {
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
                this.props.navigation.navigate(DriverHomeScreen);
              }}
              disabled={this.state.isLoadingMap}
            />
          </View>
          <View style={styles.buttons}>
            <Button
              title="Back"
              onPress={() => this.props.navigation.navigate(DriverHomeScreen)}
              disabled={this.state.isLoadingMap}
            />
          </View>
        </View>
      );
    }
    /* Note will need to set states first depending on what was clicked */
    _selectOffer () {
      this.props.navigation.navigate(ViewOfferScreen, {
        offer: this.state.selectedOffer,
        user: this.state.user,
        serviceRequest: this.state.serviceRequest
      });
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
