import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
  Picker
} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
// todo:
class MechanicProfileScreen extends React.Component {
  render () {
    return (
      <View>
        {/* need profile image here */}
        <Text>Account Type: Mechanic</Text>
        <Text>Average Rating: N/A</Text>
        <Text>Balance: $200</Text>
        <Text>Name: Joe Black</Text>
        <View style={styles.buttons}>
          <Button
            title="Edit Profile"
            onPress={() => this.props.navigation.navigate("EditProfile") }
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="History"
            onPress={() => this.props.navigation.navigate("HistoryList") }
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Balance"
            onPress={() => this.props.navigation.navigate("Balance") }
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Verify Account"
            onPress={() => this.props.navigation.navigate("Verification") }
          />
        </View>
      </View>
    );
  }
}

class EditProfile extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: ""
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Edit Profile</Text>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>First Name:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={firstName => this.setState({ firstName })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Last Name:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={lastName => this.setState({ lastName })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>E-mail:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Password:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Phone:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={phone => this.setState({ phone })}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Edit Payment Details"
            onPress={() => this.props.navigation.navigate("PaymentDetails")}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
}

class HistoryList extends React.Component {
  render () {
    return (
      <ScrollView>
        <Text style={styles.heading}>History</Text>
        <TouchableOpacity style={styles.buttonBox} onPress={() => this._viewHistoryItem()}>
          <View style={styles.buttonBoxText}>
            <Text>Date: </Text>
            <Text>Time: </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </ScrollView>
    );
  }
  _viewHistoryItem () {
    // need to get item information and give it to the history item screen
    this.props.navigation.navigate("HistoryItem");
  }
}

class HistoryItem extends React.Component {
  render () {
    return (
      <View>
        <Text style={styles.heading}>History</Text>
        <Text>Date: </Text>
        <Text>Time: </Text>
        <Text>ID: </Text>
        <Text>Driver: </Text>
        <Text>Mechanic: </Text>
        <Text>Description: </Text>
        <Text>Cost: </Text>
        <Text>Rating: </Text>
        <Text>Comments: </Text>
        <Text>Car Details</Text>
        <Text>Make: </Text>
        <Text>Model: </Text>
        <Text>Plates: </Text>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
}

class PaymentDetails extends React.Component {
  state = {
    accountNumber: "",
    bsb: ""
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Payment Details</Text>
        {/* need payment details here */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Account Number:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={accountNumber => this.setState({ accountNumber })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>BSB:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={bsb => this.setState({ bsb })}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Save"
            onPress={() => this.props.navigation._saveDetails()}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
  _saveDetails () {
    Alert.alert("you saved your details");
  }
}

class Balance extends React.Component {
  state = {
    amount: ""
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Balance</Text>
        <Text>Balance: </Text>
        { /* NOTE: should be disabled if no bank account selected */}
        <Text>Withdraw Funds</Text>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Amount: $</Text>
          <TextInput
            style={styles.textInput}
            // also need to change new balance on entering amount
            onChangeText={amount => this.setState({ amount })}
          />
        </View>
        <Text>New Balance: </Text>
        <View style={styles.buttons}>
          <Button
            title="Withdraw"
            onPress={() => this.props.navigation._withdrawFunds()}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
  _withdrawFunds () {
    Alert.alert("withdrew " + this.state.amount + " dollars");
  }
}

class Verification extends React.Component {
  state = {
    selectedDoc: "doc1"
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Verification</Text>
        <Text>Account Status: Not Verified</Text>
        <View style={styles.buttons}>
          <Button
            title="View Verification Requirements"
            onPress={() => this.props.navigation.navigate("Requirements")}
          />
        </View>
        <Text>Verification Documents</Text>
        {/* will need to be filled with list of documents that have been uploaded */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Verification Documents:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.selectedDoc}
              style={{width: 150}}
              itemStyle={{fontSize: 20}}
              mode="dropdown"
              onValueChange={selectedDoc => this.setState({ selectedDoc })}>
              <Picker.Item label="doc1" value="doc1" />
            </Picker>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            title="Upload Document"
            onPress={() => Alert.alert("choose document to upload")}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Remove Document"
            onPress={() => Alert.alert("Sure you want to remove selected document?")}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Send Verification Request"
            onPress={() => Alert.alert("Verification request sent")}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
}

class Requirements extends React.Component {
  render () {
    return (
      <View>
        <Text style={styles.heading}>Requirements</Text>
        <Text>Drivers Licence</Text>
        <Text>Mechanic Certificate</Text>
        <Text>Payment Details</Text>
        <Text>References</Text>
        <View style={styles.buttons}>
          <Button
            title="Back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
}

const MainNavigator = createStackNavigator(
  {
    Home: MechanicProfileScreen,
    EditProfile: EditProfile,
    PaymentDetails: PaymentDetails,
    HistoryList: HistoryList,
    HistoryItem: HistoryItem,
    Balance: Balance,
    Verification: Verification,
    Requirements: Requirements
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
