import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Picker,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import {
  Toast,
  Text,
  Button
} from "native-base";
import WindowBox from "@components/WindowBox";
import Patterns from "@constants/UserInputRegex";
import DatabaseService from "@lib/services/DatabaseService";
import Colors from "@constants/Colors";
import {withAuthContext} from "@lib/context/AuthContext";

class SignInCreateAccScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    selected: "SignIn",
    crAccType: "Driver",
    crAccFirstName: "",
    crAccLastName: "",
    crAccEmail: "",
    crAccPassword: "",
    crAccPhoneNo: "",
    signInEmail: "",
    signInPassword: "",
    users: null // only used for quick sign in when in dev
  }

  componentWillMount () {
    if (__DEV__) {
      DatabaseService.getDatabase(/user-/, true)
        .then(users => {
          users.unshift([
            "NONE",
            JSON.stringify({
              type: "NONE",
              email: "No user selected"
            })
          ]);
          this.setState({users});
        }).catch(err => { throw err; });
    }
  }

  render () {
    return (
      <WindowBox>
        <ScrollView style={styles.container}>
          <View style={styles.topTab}>
            <View style={styles.topButtonContainer}>
              <Button full
                info={this.state.selected === "SignIn"}
                light={this.state.selected !== "SignIn"}
                style={styles.topButton}
                onPress={() => this.setState({
                  selected: "SignIn",
                })}>
                <Text style={styles.topButtonText}>Sign In</Text>
              </Button>
            </View>
            <View style={styles.topButtonContainer}>
              <Button full
                info={this.state.selected === "CreateAccount"}
                light={this.state.selected !== "CreateAccount"}
                style={styles.topButton}
                onPress={() => this.setState({
                  selected: "CreateAccount"
                })}>
                <Text style={styles.topButtonText}>
                  Create Account
                </Text>
              </Button>
            </View>
          </View>
          {this._renderMainScreen()}
        </ScrollView>
      </WindowBox>
    );
  }

  _renderMainScreen () {
    if (this.state.selected === "SignIn") {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", backgroundColor: Colors.backgroundColor }}
          behavior="position">
          <Image
            source={require("@assets/images/car-broken-down.png")}
            style={[styles.iconImage, {height: 150, width: 150}]}
          />
          <Text style={styles.titleText}>Sign In</Text>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Email</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={email => this.setState({ signInEmail: email })}
              onSubmitEditing={() => this.textInputSignInPassword.focus()}
              placeholder="email@gmail.com"
              returnKeyType="next"
              value={this.state.signInEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Password</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              ref={input => { this.textInputSignInPassword = input; }}
              onChangeText={password => this.setState({ signInPassword: password })}
              onSubmitEditing={async () => {
                await this._validateTextInputs();
                await this._signInButtonPress();
              }}
              returnKeyType="go"
              secureTextEntry={true}
              value={this.state.signInPassword}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.wideButtonContainer}>
            <Button full info
              onPress={async () => {
                await this._validateTextInputs();
                await this._signInButtonPress();
              }}
              style={styles.wideButton}>
              <Text style={{fontSize: 22}}>Sign In</Text>
            </Button>
          </View>

          {__DEV__ &&
            <View style={[styles.centeredRowContainer, {borderWidth: 2, borderRadius: 10, borderColor: "blue"}]}>
              <Text style={styles.textBesideInput}>DEV quick sign in: </Text>
              <Picker
                style={{width: 200}}
                itemStyle={{fontSize: 20}}
                onValueChange={async user => {
                  const result = await DatabaseService.signInUser(user.email, user.password);
                  if (!result.pass) {
                    Toast.show({
                      text: result.reason,
                      buttonText: "Okay",
                      duration: 5000,
                      type: "danger",
                      style: {margin: 10, borderRadius: 15}
                    });
                  }
                }}>
                {!this.state.users ? null
                  : this.state.users.map((user, index) => {
                    user = JSON.parse(user[1]);
                    return (<Picker.Item
                      key={index}
                      label={`${user.type}, ${user.email}`}
                      value={user}
                    />);
                  })}
              </Picker>
            </View>
          }

        </KeyboardAvoidingView>
      );
    } else {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", backgroundColor: Colors.screenBackground }}
          behavior="position">
          <Image
            source={require("@assets/images/car-broken-down.png")}
            style={styles.iconImage}
          />
          <Text style={styles.titleText}>Create Account</Text>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Type</Text>
            <View style={{borderWidth: 1, borderRadius: 5}}>
              <Picker
                selectedValue={this.state.crAccType}
                style={{width: 150}}
                itemStyle={{fontSize: 20}}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ crAccType: itemValue })
                }>
                <Picker.Item label="Driver" value="Driver" />
                <Picker.Item label="Mechanic" value="Mechanic" />
              </Picker>
            </View>
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Given Name</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={firstName => this.setState({ crAccFirstName: firstName })}
              onSubmitEditing={() => this.textInputCrAccLastName.focus()}
              placeholder="John"
              returnKeyType="next"
              value={this.state.crAccFirstName}
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Surname</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              ref={input => { this.textInputCrAccLastName = input; }}
              onChangeText={lastName => this.setState({ crAccLastName: lastName })}
              onSubmitEditing={() => this.textInputCrAccEmail.focus()}
              placeholder="Smith"
              returnKeyType="next"
              value={this.state.crAccLastName}
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Email</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              ref={input => { this.textInputCrAccEmail = input; }}
              onChangeText={email => this.setState({ crAccEmail: email })}
              onSubmitEditing={() => this.textInputCrAccPassword.focus()}
              placeholder="email@gmail.com"
              returnKeyType="next"
              value={this.state.crAccEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Password</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              ref={input => { this.textInputCrAccPassword = input; }}
              onChangeText={password => this.setState({ crAccPassword: password })}
              onSubmitEditing={() => this.textInputCrAccPhoneNo.focus()}
              returnKeyType="next"
              secureTextEntry={true}
              value={this.state.crAccPassword}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Phone</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              ref={input => { this.textInputCrAccPhoneNo = input; }}
              onChangeText={phoneNo => this.setState({ crAccPhoneNo: phoneNo })}
              onSubmitEditing={async () => {
                await this._validateTextInputs();
                await this._createAccountButtonPress();
              }}
              returnKeyType="go"
              value={this.state.crAccPhoneNo}
              autoCapitalize="none"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.wideButtonContainer}>
            <Button full info
              onPress={async () => {
                await this._validateTextInputs();
                await this._createAccountButtonPress();
              }}
              style={styles.wideButton}>
              <Text style={{fontSize: 22}}>Create Account</Text>
            </Button>
          </View>

        </KeyboardAvoidingView>
      );
    }
  }

  async _signInButtonPress () {
    // Check for invalid or empty fields:
    if (!this._validateTextInputs() || !this.state.signInEmail || !this.state.signInPassword) {
      return;
    }
    // Attempt to sign the user in:
    const result = await DatabaseService.signInUser(this.state.signInEmail, this.state.signInPassword);
    if (!result.pass) {
      Toast.show({
        text: result.reason,
        buttonText: "Okay",
        duration: 5000,
        type: "danger",
        style: {margin: 10, borderRadius: 15}
      });
    }
  }

  async _createAccountButtonPress () {
    // Check for invalid or empty fields:
    if (
      !this._validateTextInputs() || !this.state.crAccFirstName || !this.state.crAccLastName ||
      !this.state.crAccEmail || !this.state.crAccPassword || !this.state.crAccPhoneNo
    ) {
      // Alert.alert("Error, one or more of the fields is empty or invalid.");
      return;
    }
    // Attempt to create the user:
    const result = await DatabaseService.createUser(
      this.state.crAccType, this.state.crAccFirstName,
      this.state.crAccLastName, this.state.crAccEmail,
      this.state.crAccPassword, this.state.crAccPhoneNo,
      true // Flag to sign them in as well
    );
    if (!result.pass) {
      Toast.show({
        text: result.reason,
        buttonText: "Okay",
        duration: 5000,
        type: "danger",
        style: {margin: 10, borderRadius: 15}
      });
    } else {
      Toast.show({
        text: `Created ${this.state.crAccEmail}, you can now sign in.`,
        buttonText: "Okay",
        duration: 5000,
        type: "success",
        style: {margin: 10, borderRadius: 15}
      });
      this.setState({selected: "SignIn"});
    }
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
    if (this.state.selected === "SignIn") {
      // Validate sign in text inputs:
      if (!this.state.signInEmail.trim().match(Patterns.email)) {
        return errorToast("Invalid email, please correct it.");
      } else if (!this.state.signInPassword.trim().match(Patterns.password)) {
        return errorToast("Password must be between 6 and 20 digits long, and with at least 1 number.");
      }
    } else {
      // Validate create account text inputs:
      if (!this.state.crAccFirstName.trim().match(Patterns.name)) {
        return errorToast("Invalid given name, please correct it.");
      } else if (!this.state.crAccLastName.trim().match(Patterns.name)) {
        return errorToast("Invalid surname, please correct it.");
      } else if (!this.state.crAccEmail.trim().match(Patterns.email)) {
        return errorToast("Invalid email, please correct it.");
      } else if (!this.state.crAccPassword.trim().match(Patterns.password)) {
        return errorToast("Password must be between 6 and 20 digits long, and with at least 1 number.");
      } else if (!this.state.crAccPhoneNo.trim().match(Patterns.phoneNo)) {
        return errorToast("Phone number invalid, please correct it.");
      }
    }
    return true;
  }
}
export default withAuthContext(SignInCreateAccScreen);

const styles = StyleSheet.create({
  iconImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 10,
    alignSelf: "center",
    zIndex: 0
  },
  titleText: {
    marginTop: 10,
    fontSize: 30,
    alignSelf: "center"
  },
  textBesideInput: {
    fontSize: 20
  },
  centeredRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20
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
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
    zIndex: 5,
  },
  topTab: {
    flex: 1,
    backgroundColor: Colors.tabBar,
    borderBottomWidth: 1,
    borderColor: Colors.tabBarBorderColor,
    zIndex: 5,
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  topButtonContainer: {
    flex: 1,
    paddingLeft: 1,
    paddingRight: 1
  },
  topButton: {
    borderRadius: 10,
    // borderWidth: 1
  },
  topButtonText: {
    textAlign: "center",
    fontSize: 18,
    padding: 10
  },
  wideButtonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  wideButton: {
    borderRadius: 10,
    padding: 5
  }
});
