import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Picker,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import WindowBox from "@components/WindowBox";
import Patterns from "@src/constants/UserInputRegex";
import UserDatabaseService from "@src/services/UserDatabaseService";

export default class SignInCreateAccScreen extends React.Component {
  static navigationOptions = {
    header: null
    // title: "Sign in or create an account."
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
    signInEmail: "",
    signInPassword: "",
    signInErrorText: ""
  }

  render () {
    return (
      <WindowBox>
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.topButtonsContainer}>
              <Button // todo: Set non-selected button's colour to darker than normal
                onPress={() => this.setState({ selected: "SignIn" })}
                title="Sign In"
                style={styles.topButton}
              />
              <Button
                onPress={() => this.setState({ selected: "CreateAccount" })}
                title="Create Account"
                style={styles.topButton}
              />
            </View>
            <View>
              {this._renderMainScreen()}
            </View>
          </ScrollView>
        </View>
      </WindowBox>
    );
  }

  _renderMainScreen () {
    if (this.state.selected === "SignIn") {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}
          behavior="position">
          <Image
            source={require("../../assets/images/icon.png")}
            style={[styles.iconImage, {height: 150, width: 150}]}
          />
          <Text style={styles.titleText}>Sign In</Text>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Email</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={email => this.setState({ signInEmail: email })}
              onEndEditing={() => {
                if (!this.state.signInEmail.trim().match(Patterns.email)) {
                  this.setState({signInErrorText: "Invalid email, please correct it."});
                } else this.setState({signInErrorText: ""});
              }}
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
              onChangeText={password => this.setState({ signInPassword: password })}
              onEndEditing={() => {
                if (!this.state.signInPassword.trim().match(Patterns.password)) {
                  this.setState({signInErrorText: "Password must be between 6 and 20 digits long, and with at least 1 number."});
                } else this.setState({signInErrorText: ""});
              }}
              returnKeyType="go"
              secureTextEntry={true}
              value={this.state.signInPassword}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Button // todo: Center and stretch this button properly as in the design
              onPress={async () => {
                // Check for invalid or empty fields:
                if (this.state.signInErrorText || !this.state.signInEmail || !this.state.signInPassword) {
                  Alert.alert("Error, one or more of the fields is empty or invalid.");
                  return;
                }
                // Attempt to sign the user in:
                const result = await UserDatabaseService.signInUser(this.state.signInEmail, this.state.signInPassword);
                console.log(JSON.stringify(result));
                if (!result.pass) this.setState({signInErrorText: result.reason});
                else {
                  // Change screen to Main:
                  this.props.navigation.navigate("Main");
                }
              }}
              title="Sign In"
              style={{ justifyContent: "center", alignSelf: "center" }}
            />
          </View>

          <Text style={styles.errorText}>{this.state.signInErrorText}</Text>

          {this._renderDevQuickSignInButton("driver@test.com", "test123")}
          {this._renderDevQuickSignInButton("mechanic@test.com", "test123")}
          {this._renderDevQuickSignInButton("admin@test.com", "test123")}
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}
          behavior="position"
          keyboardVerticalOffset="80">
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.iconImage}
          />
          <Text style={styles.titleText}>Create Account</Text>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Type</Text>
            <Picker
              selectedValue={this.state.crAccType}
              style={{ width: 150 }} // height: 50
              itemStyle={{ fontSize: 20 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ crAccType: itemValue })
              }>
              <Picker.Item label="Driver" value="Driver" />
              <Picker.Item label="Mechanic" value="Mechanic" />
            </Picker>
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>First Name</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={firstName => this.setState({ crAccFirstName: firstName })}
              onEndEditing={() => {
                if (!this.state.crAccFirstName.trim().match(Patterns.name)) {
                  this.setState({crAccErrorText: "Invalid first name, please correct it."});
                } else this.setState({crAccErrorText: ""});
              }}
              // placeholder="FirstName" // Perhaps just use this instead of textBesideInput
              returnKeyType="next"
              value={this.state.crAccFirstName}
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={lastName => this.setState({ crAccLastName: lastName })}
              onEndEditing={() => {
                if (!this.state.crAccLastName.trim().match(Patterns.name)) {
                  this.setState({crAccErrorText: "Invalid last name, please correct it."});
                } else this.setState({crAccErrorText: ""});
              }}
              returnKeyType="next"
              value={this.state.crAccLastName}
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Email</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={email => this.setState({ crAccEmail: email })}
              onEndEditing={() => {
                if (!this.state.crAccEmail.trim().match(Patterns.email)) {
                  this.setState({crAccErrorText: "Invalid email, please correct it."});
                } else this.setState({crAccErrorText: ""});
              }}
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
              onChangeText={password => this.setState({ crAccPassword: password })}
              onEndEditing={() => {
                if (!this.state.crAccPassword.trim().match(Patterns.password)) {
                  this.setState({crAccErrorText: "Password must be between 6 and 20 digits long, and with at least 1 number."});
                } else this.setState({crAccErrorText: ""});
              }}
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
              onChangeText={phoneNo => this.setState({ crAccPhoneNo: phoneNo })}
              onEndEditing={() => {
                if (!this.state.crAccPhoneNo.trim().match(Patterns.phoneNo)) {
                  this.setState({crAccErrorText: "Phone number invalid, please correct it."});
                } else this.setState({crAccErrorText: ""});
              }}
              returnKeyType="go"
              value={this.state.crAccPhoneNo}
              autoCapitalize="none"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.centeredRowContainer}>
            <Button // todo: Center and stretch this button properly as in the design
              onPress={() => {
                Alert.alert("todo: create the user here");
                console.log(`state: ${JSON.stringify(this.state, null, 2)}`);
                // todo: Regex all input fields, modify errorText
                this.props.navigation.navigate("Main");
              }}
              title="Create Account"
              style={{ justifyContent: "center", alignSelf: "center" }}
            />
          </View>

          <Text style={styles.errorText}>{this.state.crAccErrorText}</Text>
        </KeyboardAvoidingView>
      );
    }
  }

  _renderDevQuickSignInButton (email, password) {
    if (__DEV__) {
      return (
        <View style={styles.centeredRowContainer}>
          <Button
            onPress={async () => {
              // Attempt to sign the user in:
              const result = await UserDatabaseService.signInUser(email, password);
              if (!result.pass) this.setState({ signInErrorText: result.reason });
              else {
                // Change screen to Main:
                this.props.navigation.navigate("Main");
              }
            }}
            title={`DEV_OPTION: Sign in with ${email}`}
            style={{ justifyContent: "center", alignSelf: "center" }}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({ // todo: tidy up styles, combine some, etc.
  iconImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 10,
    alignSelf: "center"
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
    width: 150,
    paddingLeft: 5
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  topButtonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
    // alignItems: "stretch"
  },
  errorText: {
    color: "red",
    fontSize: 20
  },
  topButton: {
    // width: "40%",
    height: 40,
    alignItems: "stretch"
  },
  contentContainer: {
    paddingTop: 30
  }
});
