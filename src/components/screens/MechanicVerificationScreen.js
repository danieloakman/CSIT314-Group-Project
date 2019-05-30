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
  Label
} from "native-base";
import {withNavigation} from "react-navigation";
import HeaderBar from "@molecules/HeaderBar";
import DatabaseService from "@lib/services/DatabaseService";
import Patterns from "@constants/UserInputRegex";

class MechanicVerificationScreen extends React.Component {
  state = {
    user: null
  };

  componentWillMount () {
    this.setState({user: this.props.navigation.getParam("user")});
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <HeaderBar
          title="Submit your details"
        />
        <View style={{flex: 1, marginHorizontal: 20}}>
          <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <ScrollView >
              <Text style={{marginTop: 10, fontSize: 17}}>
                {!this.state.user.verifiedMechanic &&
                "Please enter and submit the following fields. The BSB and account number will be where we deposit your earnings." +
                "After submission, an Administrator will verify your account which may take some time."}
                {this.state.user.verifiedMechanic &&
                "You may update your bank account details and licence number here if you wish. Keep in mind that you will need to wait " +
                "for an Admin to verify your account again."}
              </Text>
              <Item floatingLabel
                style={styles.item}>
                <Label>BSB</Label>
                <Input
                  keyboardType="numeric"
                  value={this.state.user.bsb}
                  onChangeText={bsb => {
                    let user = this.state.user;
                    user.bsb = bsb;
                    this.setState({user});
                  }}
                  onSubmitEditing={() => {
                    this.bankAccountNoInput._root.focus();
                  }}
                />
              </Item>
              <Item floatingLabel
                style={styles.item}>
                <Label>Bank Account Number</Label>
                <Input
                  keyboardType="numeric"
                  getRef={input => { this.bankAccountNoInput = input; }}
                  value={this.state.user.bankAccountNo}
                  onChangeText={bankAccountNo => {
                    let user = this.state.user;
                    user.bankAccountNo = bankAccountNo;
                    this.setState({bankAccountNo});
                  }}
                  onSubmitEditing={() => this.mechanicLicenceNoInput._root.focus()}
                />
              </Item>
              <Item floatingLabel
                style={styles.item}>
                <Label>Motor Vehicle Repairer Licence Number</Label>
                <Input
                  keyboardType="numeric"
                  getRef={input => { this.mechanicLicenceNoInput = input; }}
                  value={this.state.user.mechanicLicenceNo}
                  onChangeText={mechanicLicenceNo => {
                    let user = this.state.user;
                    user.mechanicLicenceNo = mechanicLicenceNo;
                    this.setState({user});
                  }}
                  onSubmitEditing={async () => { await this._submit(); }}
                />
              </Item>
              <Button info full rounded
                style={{marginTop: 10}}
                onPress={async () => { await this._submit(); }}>
                <Text style={{fontSize: 17}}>
                  {this.state.user.verifiedMechanic ? "Update" : "Submit"}
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
    if (!this.state.user.bsb.trim().match(Patterns.bsb)) {
      return errorToast("Invalid BSB, must be 6 digits long.");
    } else if (!this.state.user.bankAccountNo.trim().match(Patterns.bankAccountNo)) {
      return errorToast("Invalid bank account number, must be 10 NON-ZERO digits long.");
    } else if (!this.state.user.mechanicLicenceNo.trim().match(Patterns.mechanicLicenceNo)) {
      return errorToast("Invalid licence number, must be 7 digits long.");
    }
    return true;
  }

  async _submit () {
    if (this._validateTextInputs()) {
      let user = this.state.user;
      user.verifiedMechanic = false;
      user.awaitingVerification = true;
      await DatabaseService.saveUserChanges(user);
      Toast.show({
        text: "Submitted! Please wait while an Admin verifies your account.",
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, marginBottom: 60, borderRadius: 15}
      });
      this.props.navigation.goBack(/* {user: this.state.user} */);
    }
  }
}

export default withNavigation(MechanicVerificationScreen);

const styles = StyleSheet.create({
  item: {
    marginTop: 10
  },
  button: {
    borderRadius: 20,
  }
});
