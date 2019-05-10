import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Picker,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
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
    crAccErrorText: "",
    crAccButtonColor: Colors.screenBackground,
    crAccButtonTextColor: "black",
    signInEmail: "",
    signInPassword: "",
    signInErrorText: "",
    signInButtonColor: Colors.wideButton,
    signInButtonTextColor: "white"
  }

  render () {
    return (
      <WindowBox>
        <ScrollView style={styles.container}>
          <View style={styles.topTab}>
            <View style={styles.topButtonContainer}>
              <TouchableOpacity
                style={[styles.topButton, {backgroundColor: this.state.signInButtonColor}]}
                onPress={() => this.setState({
                  selected: "SignIn",
                  signInButtonColor: Colors.wideButton,
                  signInButtonTextColor: "white",
                  crAccButtonColor: Colors.screenBackground,
                  crAccButtonTextColor: "black"
                })}>
                <Text style={[styles.topButtonText, {color: this.state.signInButtonTextColor}]}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.topButtonContainer}>
              <TouchableOpacity
                style={[styles.topButton, {backgroundColor: this.state.crAccButtonColor}]}
                onPress={() => this.setState({
                  selected: "CreateAccount",
                  crAccButtonColor: Colors.wideButton,
                  crAccButtonTextColor: "white",
                  signInButtonColor: Colors.screenBackground,
                  signInButtonTextColor: "black"
                })}>
                <Text style={[styles.topButtonText, {color: this.state.crAccButtonTextColor}]}>
                  Create Account
                </Text>
              </TouchableOpacity>
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
            <TouchableOpacity
              onPress={async () => {
                await this._validateTextInputs();
                await this._signInButtonPress();
              }}
              style={styles.wideButton}>
              <Text style={{color: "white", fontSize: 22, textAlign: "center"}}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.errorText}>{this.state.signInErrorText}</Text>
          {__DEV__ &&
            <View>
              {this._renderDevQuickSignInButton("driver@test.com", "test123")}
              {this._renderDevQuickSignInButton("mechanic@test.com", "test123")}
              {this._renderDevQuickSignInButton("admin@test.com", "test123")}
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
            <Text style={styles.textBesideInput}>First Name</Text>
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
            <Text style={styles.textBesideInput}>Last Name</Text>
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
            <TouchableOpacity
              onPress={async () => {
                await this._validateTextInputs();
                await this._createAccountButtonPress();
              }}
              style={styles.wideButton}>
              <Text style={{color: "white", fontSize: 22, textAlign: "center"}}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.errorText}>{this.state.crAccErrorText}</Text>
        </KeyboardAvoidingView>
      );
    }
  }

  async _signInButtonPress () {
    // Check for invalid or empty fields:
    if (this.state.signInErrorText || !this.state.signInEmail || !this.state.signInPassword) {
      // Alert.alert("Error, one or more of the fields is empty or invalid.");
      return;
    }
    // Attempt to sign the user in:
    const result = await DatabaseService.signInUser(this.state.signInEmail, this.state.signInPassword);
    if (!result.pass) this.setState({signInErrorText: result.reason});
    else {
      // Change screen to Main:
      // this.props.navigation.navigate("Main");
    }
  }

  async _createAccountButtonPress () {
    // Check for invalid or empty fields:
    if (
      this.state.crAccErrorText || !this.state.crAccFirstName || !this.state.crAccLastName ||
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
    if (!result.pass) this.setState({crAccErrorText: result.reason});
    else {
      // Change to main screen:
      // this.props.navigation.navigate("Main");
    }
  }

  _validateTextInputs () {
    if (this.state.selected === "SignIn") {
      // Validate sign in text inputs:
      if (!this.state.signInEmail.trim().match(Patterns.email)) {
        this.setState({signInErrorText: "Invalid email, please correct it."});
      } else if (!this.state.signInPassword.trim().match(Patterns.password)) {
        this.setState({signInErrorText: "Password must be between 6 and 20 digits long, and with at least 1 number."});
      } else this.setState({signInErrorText: ""});
    } else {
      // Validate create account text inputs:
      if (!this.state.crAccFirstName.trim().match(Patterns.name)) {
        this.setState({ crAccErrorText: "Invalid first name, please correct it." });
      } else if (!this.state.crAccLastName.trim().match(Patterns.name)) {
        this.setState({ crAccErrorText: "Invalid last name, please correct it." });
      } else if (!this.state.crAccEmail.trim().match(Patterns.email)) {
        this.setState({ crAccErrorText: "Invalid email, please correct it." });
      } else if (!this.state.crAccPassword.trim().match(Patterns.password)) {
        this.setState({ crAccErrorText: "Password must be between 6 and 20 digits long, and with at least 1 number." });
      } else if (!this.state.crAccPhoneNo.trim().match(Patterns.phoneNo)) {
        this.setState({ crAccErrorText: "Phone number invalid, please correct it." });
      } else this.setState({ crAccErrorText: "" });
    }
  }

  _renderDevQuickSignInButton (email, password) {
    return (
      <View style={styles.wideButtonContainer}>
        <Button
          onPress={async () => {
            // Attempt to sign the user in:
            const result = await DatabaseService.signInUser(email, password);
            if (!result.pass) this.setState({ signInErrorText: result.reason });
            else {
              // Change screen to Main:
              // this.props.navigation.navigate("Main");
            }
          }}
          title={`DEV_OPTION: Sign in with ${email}`}
          style={styles.wideButton}
        />
      </View>
    );
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
    borderWidth: 0.5,
    // borderColor: "green",
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
    borderRadius: 7,
    borderWidth: 1
  },
  topButtonText: {
    textAlign: "center",
    fontSize: 22,
    padding: 10
  },
  errorText: {
    color: "red",
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  wideButtonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  wideButton: {
    backgroundColor: Colors.wideButton,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5
  }
});
