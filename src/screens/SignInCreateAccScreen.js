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
  TextInput
} from "react-native";
import WindowBox from "@components/WindowBox";

export default class SignInCreateAccScreen extends React.Component {
  static navigationOptions = {
    header: null
    // title: "Sign in or create an account."
  };

  state = {
    selected: "CreateAccount",
    crAccType: "Driver",
    crAccFirstName: "",
    crAccLastName: "",
    crAccEmail: "",
    crAccPassword: "",
    crAccPhone: "",
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
        <View style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.iconImage}
          />
          <Text style={styles.titleText}>Sign In</Text>
          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Email</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={email => this.setState({ signInEmail: email })}
              returnKeyType="next"
              value={this.state.signInEmail}
            />
          </View>
          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Password</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={password => this.setState({ signInPassword: password })}
              returnKeyType="go"
              secureTextEntry={true}
              value={this.state.signInPassword}
            />
          </View>
          <View style={styles.centeredRowContainer}>
            <Button // todo: Center and stretch this button properly as in the design
              onPress={() => {
                Alert.alert("todo: log in the user");
                // todo: Regex all input fields, modify errorText
                this.props.navigation.navigate("Main");
                console.log(`state: ${JSON.stringify(this.state, null, 2)}`);
              }}
              title="Sign In"
              style={{ justifyContent: "center", alignSelf: "center" }}
            />
          </View>
          <Text style={styles.errorText}>{this.state.signInErrorText}</Text>
        </View>
      );
    } else {
      return ( // todo: make keyboard not hide input fields
        <View style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}>
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
              returnKeyType="next"
              value={this.state.crAccEmail}
            />
          </View>
          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Password</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={password => this.setState({ crAccPassword: password })}
              returnKeyType="next"
              secureTextEntry={true}
              value={this.state.crAccPassword}
            />
          </View>
          <View style={styles.centeredRowContainer}>
            <Text style={styles.textBesideInput}>Phone</Text>
            <TextInput
              style={styles.textInput}
              editable={true}
              onChangeText={phoneNo => this.setState({ crAccPhoneNo: phoneNo })}
              returnKeyType="go"
              value={this.state.crAccPhoneNo}
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
