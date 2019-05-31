import React from "react";
import {
  StyleSheet,
  View,
  Picker
} from "react-native";
import {
  Button,
  Text
} from "native-base";
import DatabaseService from "@lib/services/DatabaseService";
import GMapView from "@components/GoogleMapView";
import {MapView} from "expo";
import HeaderBar from "@molecules/HeaderBar";
import LoadingGif from "@components/atoms/LoadingGif";

export default class RequestList extends React.Component {
    state = {
      user: null,
      location: null,
      serviceRequests: [],
      isLoadingMap: true,
      isLoadingMarkers: false,
      srIndex: null,
      maxRadius: 5000,
    }

    componentDidMount () {
      this.markerRefs = [];
    }

    render () {
      return (
        <View style={{flex: 1}}>
          <HeaderBar
            navLeft={this.state.isLoadingMap || this.state.isLoadingMarkers ? <View/> : null}
            title="Nearby Requests"
          />
          <View style={{flex: 1}}>
            <GMapView
              getRef={ref => { this.map = ref; }}
              onLocationRetrieved={async currentLocation => {
                this.setState({location: currentLocation});
                let user = await DatabaseService.getSignedInUser();
                let srArr = await DatabaseService.getAllSRsNearLocation(this.state.maxRadius / 1000, this.state.location);
                this.setState({
                  user, serviceRequests: srArr, isLoadingMap: false
                });
              }}
              scrollEnabled={!this.state.isLoadingMap && !this.state.isLoadingMarkers}
              zoomEnabled={!this.state.isLoadingMap && !this.state.isLoadingMarkers}
              rotateEnabled={!this.state.isLoadingMap && !this.state.isLoadingMarkers}
              onPressNext={() => {
                let latLng = {};
                const srArr = this.state.serviceRequests;
                let srIndex = this.state.srIndex;
                if (srIndex === null || srIndex >= srArr.length - 1) {
                  srIndex = 0;
                  latLng.latitude = srArr[0].location.coords.latitude;
                  latLng.longitude = srArr[0].location.coords.longitude;
                } else {
                  srIndex++;
                  latLng.latitude = srArr[srIndex].location.coords.latitude;
                  latLng.longitude = srArr[srIndex].location.coords.longitude;
                }
                this.map.animateToCoordinate(latLng);
                this.markerRefs[srIndex].showCallout();
                this.setState({srIndex});
              }}
              onPressPrevious={() => {
                let latLng = {};
                const srArr = this.state.serviceRequests;
                let srIndex = this.state.srIndex;
                if (srIndex === null || srIndex <= 0) {
                  srIndex = srArr.length - 1;
                  latLng.latitude = srArr[srIndex].location.coords.latitude;
                  latLng.longitude = srArr[srIndex].location.coords.longitude;
                } else {
                  srIndex--;
                  latLng.latitude = srArr[srIndex].location.coords.latitude;
                  latLng.longitude = srArr[srIndex].location.coords.longitude;
                }
                this.map.animateToCoordinate(latLng);
                this.markerRefs[srIndex].showCallout();
                this.setState({srIndex});
              }}
              topArea={<Text style={{fontSize: 17}}>
                {this.state.srIndex !== null
                  ? `Assistance Requests: ${this.state.srIndex + 1}/${this.state.serviceRequests.length}`
                  : `Assistance Requests: ${this.state.serviceRequests.length}`}
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
                      this.setState({isLoadingMarkers: true});
                      this.setState({
                        maxRadius: maxRadius * 1000,
                        serviceRequests: await DatabaseService.getAllSRsNearLocation(maxRadius, this.state.location),
                        isLoadingMarkers: false,
                        srIndex: null
                      });
                    }}>
                    {[5, 10, 25, 50, 100, 200].map((radiusValue, index) => {
                      return <Picker.Item key={index} label={radiusValue.toString() + "km"} value={radiusValue}/>;
                    })}
                  </Picker>
                </View>
              }
            >
              {this.state.isLoadingMap || this.state.isLoadingMarkers ? null
                : this.state.serviceRequests.map((sr, index) => {
                  if (
                    // Don't show any markers that this mechanic has made an offer for already:
                    sr.offers.filter(offer => {
                      return offer.mechanicEmail === this.state.user.email;
                    }).length === 0
                  ) {
                    return <MapView.Marker
                      ref={ref => {
                        if (ref) this.markerRefs.push(ref);
                      }}
                      key={index}
                      coordinate={{
                        latitude: sr.location.coords.latitude,
                        longitude: sr.location.coords.longitude
                      }}
                      onCalloutPress={async () => {
                        this._viewRequest(sr);
                      }}
                    >
                      <MapView.Callout>
                        <Text style={{fontWeight: "bold", fontSize: 15}}>
                          {`Distance: ${Math.floor(sr.distance * 100) / 100}km`}
                        </Text>
                        <Text style={{fontSize: 13}}>
                          {sr.description.length < 25 ? sr.description : `${sr.description.substring(0, 20).trim()}...`}
                        </Text>
                        <Text style={{fontStyle: "italic", fontSize: 14, alignSelf: "center"}}>
                          - Click to view -
                        </Text>
                      </MapView.Callout>
                    </MapView.Marker>;
                  }
                })}
              {this.state.isLoadingMap || this.state.isLoadingMarkers ? null
                : <MapView.Circle
                  center={{latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude}}
                  radius={this.state.maxRadius}
                  strokeWidth={2}
                  strokeColor="red"
                />}
            </GMapView>
            {this.state.isLoadingMarkers && <LoadingGif containerStyle={{position: "absolute", alignSelf: "center", bottom: "40%"}}/>}
          </View>
        </View>
      );
    }

    _viewRequest (sr) {
      this.props.navigation.navigate("MechanicRequestViewModal", {
        selectedSR: sr,
        user: this.state.user,
        location: this.state.location
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
