import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  Picker
  // TouchableOpacity,
  // Colors
} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
// todo: make buttons work, fix description input (hard to close, making too many lines makes box too big)
class DriverHomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  render () {
    /* const {navigate} = this.props.navigation; */
    return (
      <View>
        <Text style={styles.heading}>Home</Text>
        <Button
          title="Request Assistance"
          onPress={() => this.props.navigation.navigate("Request") }
        />
      </View>
    );
  }
}

class RequestScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    address: "",
    suburb: "",
    descripton: "",
    selectedState: "NSW",
    car: "car 1"
  }
  render () {
    return (
      <View>
        <Text style={styles.heading}>Roadside Assistance Request</Text>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Address:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="123 street name"
            onChangeText={address => this.setState({ address })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>Suburb:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={suburb => this.setState({ suburb })}
          />
        </View>
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>State:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.selectedState}
              style={{width: 150}}
              itemStyle={{fontSize: 20}}
              mode="dropdown"
              onValueChange={selectedState => this.setState({ selectedState })}
            >
              <Picker.Item label="NSW" value="NSW" />
              <Picker.Item label="VIC" value="VIC" />
              <Picker.Item label="QLD" value="QLD" />
              <Picker.Item label="WA" value="WA" />
              <Picker.Item label="SA" value="SA" />
              <Picker.Item label="NT" value="NT" />
              <Picker.Item label="ACT" value="ACT" />
            </Picker>
          </View>
        </View>

        <Button
          style="buttons"
          title="Use GPS Location"
          onPress={() => Alert.alert("not implemented yet")}
          /* NOTE: for google maps integration */
          /* can probably remove address, suburb, state if using GPS/google maps instead */
        />
        {/* need dropdown for car selection */}
        <View style={styles.centeredRowContainer}>
          <Text style={styles.textBesideInput}>State:</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={this.state.car}
              style={{width: 150}}
              itemStyle={{fontSize: 20}}
              mode="dropdown"
              onValueChange={car => this.setState({ car })
              }>
              <Picker.Item label="car 1" value="car 1" />
              <Picker.Item label="car 2" value="car 2" />
              <Picker.Item label="car 3" value="car 3" />
            </Picker>
          </View>
        </View>
        <Text style={{fontSize: 20, marginLeft: 20}}>Description</Text>
        <TextInput
          style={styles.textBox}
          multiline = {true}
          numberOfLines = {3}
          onChangeText={descripton => this.setState({ descripton })}
        />
        <Button
          style="buttons"
          title="Submit"
          onPress={() => this._showInputFields()}
        />
      </View>

    );
  }
  _showInputFields () {
    Alert.alert(
      "Address: " + this.state.address +
      "\nSuburb: " + this.state.suburb +
      "\nState: " + this.state.selectedState +
      "\nDescription: " + this.state.descripton +
      "\nCar: " + this.state.car
    );
  }
}

const MainNavigator = createStackNavigator(
  {
    Home: DriverHomeScreen,
    Request: RequestScreen
  },
  {
    initialRouteName: "Home"
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
    alignSelf: "center",
    width: "60%"
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
  }
});
