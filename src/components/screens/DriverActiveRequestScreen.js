import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Slider,
  ScrollView
} from "react-native";
import {
  Toast,
  Item,
  Label,
  Input,
} from "native-base";
import DatabaseService from "@lib/services/DatabaseService";
import HeaderBar from "@molecules/HeaderBar";

// import DriverHomeScreen from "@components/screens/DriverHomeScreen";

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
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      this.props.navigation.goBack();
    }

    async _cancelOffer () {
      Toast.show({
        text: "Cancelled assistance, please choose an another offer.",
        buttonText: "Okay",
        duration: 5000,
        type: "warning",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      this.props.navigation.goBack();
    }

    render () {
      return (
        <View>
          <ScrollView>
            <HeaderBar
              navMid={<Text style={styles.heading}>Active Request</Text>}
              navRight={<View/>} // Just to center the heading
            />
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
            <Item floatingLabel style={styles.centeredRowContainer}>
              <Label style={{lineHeight: 40, textAlignVertical: "top", fontSize: 20}}>Any additional comments:</Label>
              <Input multiline style={{paddingTop: 20, fontSize: 20}} />
            </Item>
            <View style={styles.buttons}>
              <Button
                title="Complete Assistance Request"
                onPress={async () => {
                  await this._completeServiceRequest();
                }}
              />
            </View>
            <View style={styles.buttons}>
              <Button
                title="Cancel assistance and re-choose another offer"
                onPress={async () => {
                  await this._cancelOffer();
                }}
              />
            </View>
          </ScrollView>
        </View>
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
