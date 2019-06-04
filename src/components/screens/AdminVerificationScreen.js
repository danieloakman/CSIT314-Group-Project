import React from "react";
import {
  View,
  ScrollView,
} from "react-native";
import {
  Button,
  Icon,
  Text,
  Tabs,
  Tab,
  Toast,
  SwipeRow,
  Left,
} from "native-base";
import {withNavigation} from "react-navigation";
import HeaderBar from "@molecules/HeaderBar";
import PhoneNumberLink from "@components/atoms/PhoneNumberLink";
// import DatabaseService from "@lib/services/DatabaseService";
import HelpButton from "@atoms/HelpButton";
import _ from "lodash";

import {withAuthContext} from "@lib/context/AuthContext";

import User from "@model/user";

class AdminVerificationScreen extends React.Component {
  state = {
    mechanics: []
  };

  componentDidMount () {
    let currentUser = this.props.AuthContext.user;
    Promise.all([
      User.getMechanicsAwaitingVerification(),
      currentUser.getVerifiedMechanics() // Gets all verified mechanics who have been verified by the current admin
    ])
      .then(
        (values) => {
          this.setState({mechanics: _.union(values[0], values[1])});
        }
      )
      .catch(err => { throw err; });
  }

  render () {
    let user = this.props.navigation.getParam("user"); // todo: log - mechanic was approved by this user
    return (
      <View style={{flex: 1}}>
        <HeaderBar
          title="Mechanic Verification"
          navRight={<HelpButton
            message="Swipe left and right then press the green and red buttons to approve and deny mechanics."
          />}
        />
        {this.state.mechanics &&
          <Tabs locked
            tabStyle={{backgroundColor: "blue"}}
            // activeTabStyle={{backgroundColor: "blue"}}
          >
            <Tab heading="Unverified"
              activeTabStyle={{backgroundColor: "grey"}}
              tabStyle={{backgroundColor: "grey"}}
            >
              <ScrollView>
                {this.state.mechanics
                  .filter(mechanic => !mechanic.isVerified && mechanic.awaitingVerification)
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
            <Tab heading="Verified"
              activeTabStyle={{backgroundColor: "grey"}}
              tabStyle={{backgroundColor: "grey"}}
            >
              <ScrollView>
                {this.state.mechanics
                  .filter(mechanic => mechanic.isVerified)
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
    await mechanic.verify(this.props.AuthContext.user.id);
    Toast.show({
      text: `Approved ${mechanic.fullName}`,
      buttonText: "Okay",
      duration: 5000,
      type: "success",
      style: {margin: 10, borderRadius: 15}
    });
    this.forceUpdate();

    // Dunno what this was doing, seems kinda redundant
    // this.setState({
    //   mechanics: this.state.mechanics.map(listedMechanic => {
    //     if (listedMechanic.id === mechanic.id) {
    //       return mechanic;
    //     } else return listedMechanic;
    //   })
    // });
  }

  async _deny (mechanic) {
    await mechanic.verify(this.props.AuthContext.user.id, true);
    Toast.show({
      text: `Denied ${mechanic.fullName}`,
      buttonText: "Okay",
      duration: 5000,
      type: "danger",
      style: {margin: 10, borderRadius: 15}
    });
    this.forceUpdate();
    // this.setState({
    //   mechanics: this.state.mechanics.map(listedMechanic => {
    //     if (listedMechanic.id === mechanic.id) {
    //       return mechanic;
    //     } else return listedMechanic;
    //   })
    // });
  }
}

export default withNavigation(withAuthContext(AdminVerificationScreen));

class MechanicListItem extends React.Component {
  render () {
    let mechanic = this.props.mechanic;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text>{mechanic.fullName}, {mechanic.email}.</Text>
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
