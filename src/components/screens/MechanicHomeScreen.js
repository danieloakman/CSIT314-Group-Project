import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  Picker
} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
import DatabaseService from "@lib/services/DatabaseService";
import GMapView from "@components/GoogleMapView";
import {MapView} from "expo";

// todo:
class MechanicHomeScreen extends React.Component {
  render () {
    return (
      <View>
        <Text style={styles.heading}>Home</Text>
        <View style={styles.buttons}>
          <Button
            title="View Nearby Requests"
            onPress={() => this.props.navigation.navigate("RequestList") }
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="View Current Offer"
            onPress={() => this.props.navigation.navigate("RequestView") }
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="View Active Assistance Request"
            onPress={() => this.props.navigation.navigate("RequestView") }
          />
        </View>
      </View>
    );
  }
}

class RequestList extends React.Component {
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
          <Text style={styles.heading}>Nearby Requests</Text>
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
          {/* NOTE: haven't tested if disabled works properly */}
          <View style={styles.buttons}>
            <Button
              title="View Request"
              onPress={() => this._viewRequest(this.state.selectedSR)}
              disabled={!this.state.srSelected}
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
  _viewRequest () {
    this.props.navigation.navigate("RequestView", {
      selectedSR: this.state.selectedSR,
      user: this.state.user,
      location: this.state.location
    });
  }
}
// if possible, make map to and from
class RequestView extends React.Component {
  state = {
    offerAmount: null,
    selectedSR: null,
    user: null,
    location: null,
    offerMade: false,
  }
  componentWillMount () {
    /* get parameters from the list item which was clicked */
    const { navigation } = this.props;
    this.setState({
      selectedSR: navigation.getParam("selectedSR", "The selected service request"),
      user: navigation.getParam("user", "Currently signed in mechanic"),
      location: navigation.getParam("location", "Current location")
    });
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Request</Text>
        <View>
          <Text>Distance: {`${Math.round(this.state.selectedSR.distance * 100) / 100}km`}</Text>
          <Text>Time: {this.state.selectedSR.creationDate}</Text>
          <Text>Description: {this.state.selectedSR.description}</Text>
          <Text>Status: {this.state.selectedSR.status}</Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title="View Car Info"
            onPress={() => Alert.alert("go to car info page for requests car")}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="View Driver Profile"
            onPress={() => Alert.alert("go to driver profile view")}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Offer Amount: $</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={offerAmount => this.setState({ offerAmount })}
            onSubmitEditing={async () => {
              await this._submitOfferToServiceRequest();
            }}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Make Offer"
            onPress={async () => {
              await this._submitOfferToServiceRequest();
            }}
          />
        </View>
        {/* for cancelling requests (not implemented yet) */}
        <Text>Offered Amount: ${this.state.offerAmount}</Text>
        <View style={styles.buttons}>
          <Button
            title="Cancel Offer"
            onPress={() => Alert.alert("cancel request")}
            disabled={!this.state.offerMade}
          />
        </View>
        <View style={styles.buttons}>
          {!this.state.offerMade ? true
            : <Button
              title="Back"
              onPress={() => this.props.navigation.navigate("Home")}
            />
          }
          {this.state.offerMade ? true
            : <Button
              title="Back"
              onPress={() => this.props.navigation.goBack()}
            />
          }
        </View>
      </View>
    );
  }

  async _submitOfferToServiceRequest () {
    if (!this.state.offerAmount || isNaN(parseFloat(this.state.offerAmount))) {
      Alert.alert("Please input a valid numerical amount for the offer.");
      return;
    }
    await Promise.all([
      new Promise(async resolve => {
        // Update the sevice request:
        let sr = this.state.selectedSR;
        sr.offers.push({
          creationDate: new Date(),
          mechanicEmail: this.state.user.email,
          mechanicRating: this.state.user.rating,
          offerAmount: this.state.offerAmount,
          location: this.state.location
        });
        await DatabaseService.saveServiceRequestChanges(sr);
        resolve(true);
      }),
      new Promise(async resolve => {
        // Update this mechanic:
        let user = this.state.user;
        user.offersSent.push(this.state.selectedSR.id);
        await DatabaseService.saveUserChanges(user);
        resolve(true);
      })
    ]);
    Alert.alert("Offer sent!");
    // NOTE: need to change active buttons on home screen
    this.props.navigation.navigate("Home");
  }
}

const MainNavigator = createStackNavigator(
  {
    Home: MechanicHomeScreen,
    RequestList: RequestList,
    RequestView: RequestView
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
