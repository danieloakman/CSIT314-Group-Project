import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import {
  Button,
  Text,
  Toast,
  Item,
  Input,
  Label,
  DatePicker
} from "native-base";
import {withNavigation} from "react-navigation";
import HeaderBar from "@molecules/HeaderBar";
// import DatabaseService from "@lib/services/DatabaseService";
// import PaymentService from "@lib/services/PaymentService";
import Transaction from "@model/Transaction";
import Patterns from "@constants/UserInputRegex";
// import Driver from "@src/lib/model/user/Driver";

// const maximumDate = new Date(new Date().getFullYear() + 5, 0, 0);

class DriverPayMemDetailsScreen extends React.Component {
  state = {
    user: null
  };

  componentWillMount () {
    const user = this.props.navigation.getParam("user");
    this.setState({
      user,
      cardNo: user.cardNo,
      cardExpiry: user.cardExpiry,
      cardCSV: user.cardCSV
    });
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <HeaderBar
          title="Card Details and Membership"
        />
        <View style={{flex: 1, marginHorizontal: 20}}>
          <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <ScrollView>
              <Text style={{marginTop: 10, fontSize: 15, marginBottom: 10}}>
                {"  -  Pay-on-demand: \nSave your card details now and pay for road side assisstance as you need it. " +
                "Note, there is a 25% service fee added with every assistance request." +
                "\n  -  Membership Subscription: \n" +
                `For $${Transaction.MEMBERSHIP_PRICE} you can have free unlimited road side assitance for one year! No other costs included. ` +
                "\nAlso, you do not need to save your card details if you have membership."}
                {/* {this.state.user.validCardDetails &&
                "You have a valid card saved!"}
                {this.state.user.membership &&
                "You have membership!"} */}
              </Text>
              <Item floatingLabel
                style={styles.item}>
                <Label>Number on Card</Label>
                <Input
                  keyboardType="numeric"
                  value={this.state.cardNo}
                  onChangeText={cardNo => {
                    this.setState({cardNo});
                  }}
                />
              </Item>
              <View style={[styles.centeredRowContainer, {borderBottomWidth: 1, borderColor: "lightgrey"}]}>
                <Text style={{fontSize: 17, color: "grey", marginTop: 20, marginLeft: 2}}>
                  Card Expiry Date: {this.state.cardExpiry.getTime() > 0
                    ? `${this.state.cardExpiry.getMonth()}/${this.state.cardExpiry.getFullYear()}`
                    : "Missing date"}
                </Text>
                <DatePicker
                  defaultDate={this.state.user.cardExpiry}
                  minimumDate={new Date()}
                  maximumDate={new Date(new Date().getFullYear() + 5, 0, 0)} // today's date + 5 years
                  locale="en"
                  animationType="none"
                  androidMode="spinner"
                  placeHolderText=""
                  textStyle={{color: "rgba(0,0,0,0)", marginHorizontal: -170}}
                  onDateChange={date => {
                    this.setState({cardExpiry: date});
                  }}
                />
              </View>
              <Item floatingLabel
                style={styles.item}>
                <Label>Card CSV (3 digits on the back)</Label>
                <Input
                  keyboardType="numeric"
                  value={this.state.cardCSV}
                  onChangeText={cardCSV => {
                    this.setState({cardCSV});
                  }}
                  // onSubmitEditing={async () => { await this._saveCardDetails(); }}
                />
              </Item>
              <Button info full rounded
                style={{marginTop: 10}}
                onPress={async () => { await this._saveCardDetails(); }}>
                <Text style={{fontSize: 17}}>{this.state.user.isCardValid ? "Update" : "Save"} Card Details</Text>
              </Button>
              {this.state.user.isCardValid &&
              <Button info full rounded
                style={{marginTop: 10}}
                onPress={async () => { await this._deleteCardDetails(); }}
                disabled={this.state.user.srId !== null}>
                <Text style={{fontSize: 17}}>
                  {this.state.user.srId
                    ? "Cannot delete card with ongoing assistance request"
                    : "Delete your Card Details"}
                </Text>
              </Button>}
              <Button info full rounded
                style={{marginTop: 10}}
                onPress={async () => { await this._signUpForMembership(); }}
                disabled={this.state.user.isMember}>
                <Text style={{fontSize: 17, color: this.state.user.isMember ? "green" : "white"}}>
                  {this.state.user.isMember ? "You have Membership!" : "Sign up for membership"}
                </Text>
              </Button>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }

  _validateTextInputs () {
    const errorToast = (text) => {
      Toast.show({
        text,
        buttonText: "Okay",
        duration: 5000,
        type: "danger",
        style: {margin: 10, borderRadius: 15}
      });
      return false;
    };
    if (!this.state.cardNo.trim().match(Patterns.cardNo)) {
      return errorToast("Invalid card number, must be 16 digits long.");
    } else if (!this.state.cardExpiry.getTime() > 0) {
      return errorToast("Please enter an expiry date.");
    } else if (!this.state.cardCSV.trim().match(Patterns.cardCSV)) {
      return errorToast("Invalid card CSV, must be 3 digits long.");
    }
    return true;
  }

  async _saveCardDetails () {
    if (this._validateTextInputs()) {
      // let user = this.state.user;
      // user.validCardDetails = true;
      // await DatabaseService.saveUserChanges(user);
      await this.state.user.addCard({cardNo: this.state.cardNo, cardExpiry: this.state.cardExpiry, cardCSV: this.state.cardCSV});
      // this.setState({user});
      this.forceUpdate();
      Toast.show({
        text: "Successfully updated card details!",
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
    }
  }

  async _deleteCardDetails () {
    await this.state.user.removeCard();
    this.setState({cardNo: "", cardCSV: "", cardExpiry: new Date(0)});
    this.forceUpdate();
    Toast.show({
      text: "Successfully deleted card details.",
      buttonText: "Okay",
      duration: 5000,
      type: "success",
      style: {margin: 10, marginBottom: 60, borderRadius: 15}
    });
  }

  async _signUpForMembership () {
    if (this._validateTextInputs()) {
      // let user = this.state.user;
      // let result = await PaymentService.payForMembership(user);
      let result = await this.state.user.addMembership({
        cardNo: this.state.cardNo,
        cardExpiry: this.state.cardExpiry,
        cardCSV: this.state.cardCSV
      });
      if (!result.ok) {
        Toast.show({
          text: "Unsuccessful membership subscription. Reason/error: " + result.reason,
          buttonText: "Okay",
          duration: 5000,
          type: "danger",
          style: {margin: 10, marginBottom: 60, borderRadius: 15}
        });
        return;
      }
      // user.paymentIds.push(result.paymentId);
      // user.cardNo = user.cardExpiry = user.cardCSV = ""; // User didn't press save card button, so don't save it.
      // await DatabaseService.saveUserChanges(user);
      Toast.show({
        text: `$200 has been charged to your account. You now have Membership until ${this.state.user.membershipEndingDate.toLocaleDateString()}`,
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      this.props.navigation.goBack();
    }
  }
}

export default withNavigation(DriverPayMemDetailsScreen);

const styles = StyleSheet.create({
  item: {
    marginTop: 10
  },
  button: {
    borderRadius: 20,
  },
  centeredRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  }
});
