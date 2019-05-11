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
  Picker,
  Image
} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
// todo:
class MechanicProfileScreen extends React.Component {
  render () {
    return (
      <View>
        {/* profile image and description (placeholder image) */}
        <View style={styles.centeredRowContainer}>
          <Image
            source={require("@assets/images/car-broken-down.png")}
            style={[styles.iconImage, {height: 150, width: 150}]}
          />
          <View>
            <Text>Account Type: Admin</Text>
            <Text>Name: Homer Simpson</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            title="Edit Profile"
            onPress={() => this.props.navigation.navigate("EditProfile") }
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Verification History"
            onPress={() => this.props.navigation.navigate("HistoryList") }
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="View Verification Requests"
            onPress={() => this.props.navigation.navigate("VerificationList") }
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Search User"
            onPress={() => this.props.navigation.navigate("SearchUser") }
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
          <Text style={styles.textBesideInput}>Given Name:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={firstName => this.setState({ firstName })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Surname:</Text>
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
        <Text style={styles.heading}>Verification History</Text>
        <TouchableOpacity style={styles.buttonBox} onPress={() => this._viewHistoryItem()}>
          <View style={styles.buttonBoxText}>
            <Text>Date: </Text>
            <Text>Time: </Text>
            <Text>ID: </Text>
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
        <Text style={styles.heading}>Verification History</Text>
        <Text>Date: </Text>
        <Text>Time: </Text>
        <Text>Mechanic: </Text>
        <Text>Approval: </Text>
        <Text>ID: </Text>
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

class VerificationList extends React.Component {
  render () {
    return (
      <ScrollView>
        <Text style={styles.heading}>Verification Requests</Text>
        <TouchableOpacity style={styles.buttonBox} onPress={() => this._viewVerificationItem()}>
          <View style={styles.buttonBoxText}>
            <Text>Date: </Text>
            <Text>Time: </Text>
            <Text>ID: </Text>
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
  _viewVerificationItem () {
    // need to get item information and give it to the verification item screen
    this.props.navigation.navigate("VerificationItem");
  }
}
/* Verification Request Approval Screen */
class VerificationItem extends React.Component {
  state = {
    selectedDoc: "doc1"
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Verification Request Approval</Text>
        <Text>Date: </Text>
        <Text>Time: </Text>
        <Text>Mechanic: </Text>
        <Text>ID: </Text>
        <View style={styles.buttons}>
          <Button
            title="View Mechanic Profile"
            onPress={() => Alert.alert("view profile...")}
          />
        </View>
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
            title="View Document"
            onPress={() => this._viewDocument()}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Approve"
            onPress={() => this._approve()}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Deny"
            onPress={() => this._deny()}
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
  _approve () {
    // add to list as approved item
    this.props.navigation.navigate("VerificationList");
  }
  _deny () {
    // add to list as denied item
    this.props.navigation.navigate("VerificationList");
  }
  _viewDocument () {
    Alert.alert("viewing doc: " + this.state.selectedDoc);
  }
}

class SearchUser extends React.Component {
  state = {
    selectedType: "Any",
    firstName: "",
    lastName: "",
    email: ""
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Search User</Text>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Type:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.selectedType}
              style={{width: 150}}
              itemStyle={{fontSize: 20}}
              mode="dropdown"
              onValueChange={selectedType => this.setState({ selectedType })}>
              <Picker.Item label="Any" value="Any" />
              <Picker.Item label="Mechanic" value="Mechanic" />
              <Picker.Item label="Driver" value="Driver" />
            </Picker>
          </View>
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Given Name:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={firstName => this.setState({ firstName })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Surname:</Text>
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
        <View style={styles.buttons}>
          <Button
            title="Search"
            onPress={() => this._search()}
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
  _search () {
    this.props.navigation.navigate("SearchResults");
  }
}

class SearchResults extends React.Component {
  render () {
    return (
      <View>
        <ScrollView>
          <Text style={styles.heading}>Verification Requests</Text>
          <TouchableOpacity style={styles.buttonBox} onPress={() => this._viewProfile()}>
            <View style={styles.buttonBoxText}>
              <Text>Name: </Text>
              <Text>E-mail: </Text>
              <Text>Type: </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.buttons}>
            <Button
              title="Back"
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
  _viewProfile () {
    Alert.alert("view profile... again");
  }
}

const MainNavigator = createStackNavigator(
  {
    Home: MechanicProfileScreen,
    EditProfile: EditProfile,
    HistoryList: HistoryList,
    HistoryItem: HistoryItem,
    VerificationList: VerificationList,
    VerificationItem: VerificationItem,
    SearchUser: SearchUser,
    SearchResults: SearchResults
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
