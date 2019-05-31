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

export default class OfferList extends React.Component {
    state = {
      user: null,
      serviceRequest: null,
      displayOffers: null,
      location: null,
      isLoadingMap: true,
      isLoadingMarkers: false,
      offerIndex: null,
      maxRadius: 5000,
    }

    componentDidMount () {
      let user = this.props.navigation.getParam("user", "The current user");
      this.setState({user});
      this.markerRefs = [];
    }

    render () {
      return (
        <View style={{flex: 1}}>
          <HeaderBar
            navLeft={this.state.isLoadingMap || this.state.isLoadingMarkers ? <View/> : null}
            title="Offers"
          />
          <View style={{flex: 1}}>
            <GMapView
              getRef={ref => { this.map = ref; }}
              onLocationRetrieved={async currentLocation => {
                let serviceRequest = await DatabaseService.getServiceRequest(this.state.user.srId);
                let displayOffers = serviceRequest.offers
                  .filter(offer => {
                    const distance = LocationService.getDistanceBetween(offer.location.coords, currentLocation.coords);
                    if (distance < this.state.maxRadius / 1000) return true;
                  }).sort((a, b) => {
                    return LocationService.getDistanceBetween(a.location.coords, currentLocation.coords) -
                      LocationService.getDistanceBetween(b.location.coords, currentLocation.coords);
                  });
                this.setState({
                  serviceRequest,
                  displayOffers,
                  isLoadingMap: false,
                  location: currentLocation
                });
              }}
              scrollEnabled={!this.state.isLoadingMap && !this.state.isLoadingMarkers}
              zoomEnabled={!this.state.isLoadingMap && !this.state.isLoadingMarkers}
              rotateEnabled={!this.state.isLoadingMap && !this.state.isLoadingMarkers}
              onPressNext={() => {
                let latLng = {};
                const offers = this.state.displayOffers;
                let offerIndex = this.state.offerIndex;
                if (offerIndex === null || offerIndex >= offers.length - 1) {
                  offerIndex = 0;
                  latLng.latitude = offers[0].location.coords.latitude;
                  latLng.longitude = offers[0].location.coords.longitude;
                } else {
                  offerIndex++;
                  latLng.latitude = offers[offerIndex].location.coords.latitude;
                  latLng.longitude = offers[offerIndex].location.coords.longitude;
                }
                this.map.animateToCoordinate(latLng);
                this.markerRefs[offerIndex].showCallout();
                this.setState({offerIndex});
              }}
              onPressPrevious={() => {
                let latLng = {};
                const offers = this.state.displayOffers;
                let offerIndex = this.state.offerIndex;
                if (offerIndex === null || offerIndex <= 0) {
                  offerIndex = offers.length - 1;
                  latLng.latitude = offers[offerIndex].location.coords.latitude;
                  latLng.longitude = offers[offerIndex].location.coords.longitude;
                } else {
                  offerIndex--;
                  latLng.latitude = offers[offerIndex].location.coords.latitude;
                  latLng.longitude = offers[offerIndex].location.coords.longitude;
                }
                this.map.animateToCoordinate(latLng);
                this.markerRefs[offerIndex].showCallout();
                this.setState({offerIndex});
              }}
              topArea={this.state.serviceRequest &&
                <Text style={{fontSize: 17}}>
                  {this.state.offerIndex !== null
                    ? `Offers: ${this.state.offerIndex + 1}/${this.state.serviceRequest.offers.length}`
                    : `Offers: ${this.state.serviceRequest.offers.length}`}
                </Text>}
              bottomArea={
                <View style={styles.centeredRowContainer}>
                  <Text>Radius:</Text>
                  <Picker
                    selectedValue={this.state.maxRadius / 1000}
                    style={{width: 120}}
                    itemStyle={{fontSize: 20}}
                    mode="dropdown"
                    onValueChange={async maxRadius => {
                      this.markerRefs = [];
                      let displayOffers = this.state.serviceRequest.offers
                        .filter(offer => {
                          const distance = LocationService.getDistanceBetween(offer.location.coords, this.state.location.coords);
                          if (distance < maxRadius) return true;
                        }).sort((a, b) => {
                          return LocationService.getDistanceBetween(a.location.coords, this.state.location.coords) -
                            LocationService.getDistanceBetween(b.location.coords, this.state.location.coords);
                        });
                      this.setState({
                        maxRadius: maxRadius * 1000,
                        offerIndex: null,
                        displayOffers
                      });
                    }}>
                    {[5, 10, 25, 50, 100, 200].map((radiusValue, index) => {
                      return <Picker.Item key={index} label={radiusValue.toString() + "km"} value={radiusValue}/>;
                    })}
                  </Picker>
                </View>
              }>
              {this.state.isLoadingMap ? null
                : this.state.displayOffers.map((offer, index) => {
                  const distance = LocationService.getDistanceBetween(offer.location.coords, this.state.location.coords);
                  const rating = !isNaN(parseFloat(offer.mechanicRating))
                    ? offer.mechanicRating + "/5"
                    : offer.mechanicRating;
                  return <MapView.Marker
                    ref={ref => {
                      if (ref) this.markerRefs.push(ref);
                    }}
                    key={index}
                    coordinate={{
                      latitude: offer.location.coords.latitude,
                      longitude: offer.location.coords.longitude
                    }}
                    onCalloutPress={() => this._selectOffer(offer)}
                  >
                    <MapView.Callout>
                      <Text style={{fontWeight: "bold", fontSize: 15}}>
                        {`Distance: ${Math.floor(distance * 100) / 100}km`}
                      </Text>
                      <Text style={{fontSize: 13}}>
                        {`$${offer.offerAmount}, Rating: ${rating}`}
                      </Text>
                      <Text style={{fontStyle: "italic", fontSize: 14, alignSelf: "center"}}>
                        - Click to view -
                      </Text>
                    </MapView.Callout>
                  </MapView.Marker>;
                })}
              {this.state.isLoadingMap || this.state.isLoadingMarkers ? null
                : <MapView.Circle
                  center={{latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude}}
                  radius={this.state.maxRadius}
                  strokeWidth={2}
                  strokeColor="red"
                />}
            </GMapView>
          </View>
          {/* <View style={styles.buttons}> // todo move this somewhere else, probably replace disabled make request button with this when driver has a sr
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
          </View> */}
        </View>
      );
    }

    _selectOffer (offer) {
      this.props.navigation.navigate("DriverViewOfferModal", {
        offer,
        user: this.state.user,
        serviceRequest: this.state.serviceRequest
      });
    }
}

const styles = StyleSheet.create({
  centeredRowContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 20,
    paddingLeft: 5,
    backgroundColor: "rgba(150, 150, 150, 0.3)",
    marginBottom: 2,
    // height: 70,
    // marginLeft: 20,
    // marginRight: 20
  }
});
