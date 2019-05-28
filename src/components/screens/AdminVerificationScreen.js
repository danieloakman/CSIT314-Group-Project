import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Picker,
  Image,
  Platform
} from "react-native";
import {
  Accordion,
  Button,
  Card,
  CardItem,
  Icon,
  Text,
  Tabs,
  Tab,
  Toast,
  SwipeRow,
  Left,
  Right
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import {withNavigation} from "react-navigation";
import HeaderBar from "@molecules/HeaderBar";
import PhoneNumberLink from "@components/atoms/PhoneNumberLink";
import DatabaseService from "@lib/services/DatabaseService";
import Colors from "@constants/Colors";
import HelpButton from "@atoms/HelpButton";
const alert = Alert.alert;

class AdminVerificationScreen extends React.Component {
  state = {
    mechanics: null
  };

  componentDidMount () {
    DatabaseService.getUserBySearch({type: "mechanic"})
      .then(mechanics => {
        this.setState({mechanics});
      })
      .catch(err => { throw err; });
  }

  render () {
    let user = this.props.navigation.getParam("user"); // todo: log - mechanic was approved by this user
    return (
      <View style={{flex: 1}}>
        <HeaderBar
          navMid={<Text style={styles.heading}>Verification of Mechanics</Text>}
          navRight={<HelpButton
            message="Swipe left and right then press the green and red buttons to approve and deny mechanics."
          />}
        />
        {this.state.mechanics &&
          <Tabs locked
            tabStyle={{backgroundColor: "blue"}}
            // activeTabStyle={{backgroundColor: "blue"}}
          >
            <Tab heading="Verify Mechanics"
              activeTabStyle={{backgroundColor: "grey"}}
              tabStyle={{backgroundColor: "grey"}}
            >
              <ScrollView>
                {this.state.mechanics
                  .filter(mechanic => !mechanic.verifiedMechanic && mechanic.awaitingVerification)
                  .map((mechanic, index) => {
                    return (
                      <SwipeRow key={index}
                        leftOpenValue={65}
                        rightOpenValue={-65}
                        stopLeftSwipe={80}
                        stopRightSwipe={-80}
                        left={
                          <Button success onPress={() => this._approve(mechanic)}>
                            <Icon active type="Entypo" name="thumbs-up"/>
                          </Button>
                        }
                        body={
                          <MechanicListItem mechanic={mechanic}/>
                        }
                        right={
                          <Button danger onPress={() => this._deny(mechanic)}>
                            <Icon active type="Entypo" name="thumbs-down"/>
                          </Button>
                        }
                      />
                    );
                  })}
              </ScrollView>
            </Tab>
            <Tab heading="Verified Mechanics"
              activeTabStyle={{backgroundColor: "grey"}}
              tabStyle={{backgroundColor: "grey"}}
            >
              <ScrollView>
                {this.state.mechanics
                  .filter(mechanic => mechanic.verifiedMechanic)
                  .map((mechanic, index) => {
                    return (
                      <SwipeRow key={index}
                        leftOpenValue={0}
                        rightOpenValue={-65}
                        stopLeftSwipe={20}
                        stopRightSwipe={-80}
                        body={
                          <MechanicListItem mechanic={mechanic}/>
                        }
                        right={
                          <Button danger onPress={() => this._deny(mechanic)}>
                            <Icon active type="Entypo" name="thumbs-down"/>
                          </Button>
                        }
                      />
                    );
                  })}
              </ScrollView>
            </Tab>
          </Tabs>
        }
      </View>
    );
  }

  async _approve (mechanic) {
    Toast.show({
      text: `Approved ${mechanic.firstName} ${mechanic.lastName}`,
      buttonText: "Okay",
      duration: 5000,
      type: "success",
      style: {margin: 10, borderRadius: 15}
    });
    mechanic.verifiedMechanic = true;
    mechanic.awaitingVerification = false;
    await DatabaseService.saveUserChanges(mechanic);
    this.setState({
      mechanics: this.state.mechanics.map(listedMechanic => {
        if (listedMechanic.email === mechanic.email) {
          return mechanic.email;
        } else return listedMechanic;
      })
    });
  }

  async _deny (mechanic) {
    Toast.show({
      text: `Denied ${mechanic.firstName} ${mechanic.lastName}`,
      buttonText: "Okay",
      duration: 5000,
      type: "danger",
      style: {margin: 10, borderRadius: 15}
    });
    mechanic.verifiedMechanic = false;
    mechanic.awaitingVerification = false;
    await DatabaseService.saveUserChanges(mechanic);
    this.setState({
      mechanics: this.state.mechanics.map(listedMechanic => {
        if (listedMechanic.email === mechanic.email) {
          return mechanic.email;
        } else return listedMechanic;
      })
    });
  }
}

export default withNavigation(AdminVerificationScreen);

class MechanicListItem extends React.Component {
  render () {
    let mechanic = this.props.mechanic;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text>{mechanic.firstName} {mechanic.lastName}, {mechanic.email}.</Text>
          <Left>
            <Text>Phone NO: </Text><PhoneNumberLink phoneNo={mechanic.phoneNo} style={{fontSize: 16}} />
          </Left>
        </View>
        <View style={{flex: 1}}>
          <Text>BSB: {mechanic.bsb || "MISSING"}, Account NO: {mechanic.bankAccountNo || "MISSING"}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text>Motor Vehicle Repairer Licence NO: {mechanic.mechanicLicenceNo || "MISSING"}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "center"
  },
  card: {
    flex: 1
  },
  cardItem: {
    flex: 1
  },
  background: {
    backgroundColor: "black",
    width: 100,
    height: 100
  },
  buttonContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 2,
    marginBottom: 2
  },
  button: {
    flex: 1,
    borderRadius: 10,
    height: 30
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
