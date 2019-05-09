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
  state = {
    type: "",
    rating: "",
    name: "",
    phone: "",
    email: ""
  }
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
            <Text>Account Type: {this.state.type}</Text>
            <Text>Average Rating: {this.state.rating}</Text>
            <Text>Name: {this.state.name}</Text>
            <Text>Phone: {this.state.phone}</Text>
            <Text>E-mail: {this.state.email}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            title="History"
            onPress={() => this.props.navigation.navigate("HistoryList") }
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
        <Text>Location: </Text>
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

const MainNavigator = createStackNavigator(
  {
    Home: MechanicProfileScreen,
    HistoryList: HistoryList,
    HistoryItem: HistoryItem,
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
