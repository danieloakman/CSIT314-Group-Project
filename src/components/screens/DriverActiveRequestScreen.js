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

export default class ActiveServiceRequest extends React.Component {
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
      this.props.navigation.navigate(DriverHomeScreen);
    }

    async _cancelOffer () {
      Toast.show({
        text: "Cancelled assistance, please choose an another offer.",
        duration: 5000,
        type: "warning",
        style: {margin: 10, borderRadius: 15}
      });
      this.props.navigation.navigate(DriverHomeScreen);
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
              onPress={() => this.props.navigation.navigate(DriverHomeScreen)}
            />
          </View>
        </WindowBox>
      );
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
