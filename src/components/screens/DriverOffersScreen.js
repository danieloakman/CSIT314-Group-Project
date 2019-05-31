import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Picker,
} from "react-native";
import {
  Toast,
} from "native-base";
import DatabaseService from "@lib/services/DatabaseService";
import LocationService from "@lib/services/LocationService";
import GMapView from "@components/GoogleMapView";
import {MapView} from "expo";
import HeaderBar from "@molecules/HeaderBar";

// import "ViewOfferScreen" from "@components/screens/Driver"ViewOfferScreen"";
// import "DriverHomeScreen" from "@components/screens/"DriverHomeScreen"";

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
          <HeaderBar
            navLeft={this.state.isLoadingMap ? <View/> : null}
            title="Offers"
          />
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
                this.props.navigation.goBack();
              }}
              disabled={this.state.isLoadingMap}
            />
          </View>
        </View>
      );
    }

    _selectOffer () {
      this.props.navigation.navigate("DriverViewOfferModal", {
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
