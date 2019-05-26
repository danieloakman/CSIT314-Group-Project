import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Picker
} from "react-native";
import DatabaseService from "@lib/services/DatabaseService";
import GMapView from "@components/GoogleMapView";
import {MapView} from "expo";
import HeaderBar from "@molecules/HeaderBar";

// import RequestViewScreen from "@components/screens/MechanicRequestView";

export default class RequestList extends React.Component {
    state = {
      user: null,
      location: null,
      serviceRequests: [],
      isLoadingMap: true,
      selectedSR: null,
      srSelected: false,
      maxDistance: 50
    }

    render () {
      return (
        <View style={{flex: 1}}>
          <HeaderBar
            navLeft={this.state.isLoadingMap ? <View/> : null}
            navMid={<Text style={styles.heading}>Nearby Requests</Text>}
            navRight={<View/>} // Just to center the header
          />
          <View style={{flex: 1}}>
            <GMapView
              onLocationRetrieved={async currentLocation => {
                this.setState({location: currentLocation});
                let user = await DatabaseService.getSignedInUser();
                let srArr = await DatabaseService.getAllSRsNearLocation(50, this.state.location);
                this.setState({
                  user, serviceRequests: srArr, isLoadingMap: false
                });
              }}
            >
              {this.state.isLoadingMap ? null
                : this.state.serviceRequests.map((sr, index) => {
                  if (
                    // Don't show any markers that this mechanic has made an offer for already:
                    sr.offers.filter(offer => {
                      return offer.mechanicEmail === this.state.user.email;
                    }).length === 0
                  ) {
                    return <MapView.Marker
                      key={index}
                      coordinate={{
                        latitude: sr.location.coords.latitude,
                        longitude: sr.location.coords.longitude
                      }}
                      title={sr.description}
                      description={`Distance: ${Math.floor(sr.distance * 100) / 100}km`}
                      onPress={async () => {
                        this.setState({selectedSR: sr});
                        this.setState({srSelected: true});
                      }}
                    />;
                  }
                })}
            </GMapView>
            {!this.state.selectedSR ? null
              : <View>
                <Text>Distance: {`${Math.round(this.state.selectedSR.distance * 100) / 100}km`}</Text>
                <Text>Time: {this.state.selectedSR.creationDate}</Text>
                <Text>Description: {this.state.selectedSR.description}</Text>
              </View>
            }
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
            <View style={styles.buttons}>
              <Button
                title="View Request"
                onPress={() => this._viewRequest(this.state.selectedSR)}
                disabled={!this.state.srSelected}
              />
            </View>
          </View>
        </View>
      );
    }
    /* Note will need to set states first depending on what was clicked */
    _viewRequest () {
      this.props.navigation.navigate("MechanicRequestViewModal", {
        selectedSR: this.state.selectedSR,
        user: this.state.user,
        location: this.state.location
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
