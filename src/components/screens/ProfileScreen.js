/*
  A generic driverprofile component for rendering any driver's profile
  If it is the active driver's profile, it will display an edit button
*/
import React from "react";
import {
  Text,
  View
} from "react-native";

import {
  Card,
  CardItem,
  Button
} from "native-base";

import ProfileHeader from "@molecules/ProfileHeader";
import HeaderBar from "@molecules/HeaderBar";
import VehicleCard from "@molecules/VehicleCard";

import {withAuthContext} from "@lib/context/AuthContext";

import User from "@model/user";
import UserDB from "@database/user";
import StickyTabTemplate from "@templates/StickyTabTemplate";

/**
 * Takes a prop to define which profile to display
 * If it's the active user, extra options are given
 */
class ProfileScreen extends React.Component {
  constructor (props) {
    super(props);
    // TODO: if given an email instead of id, resolve to id
    this.state = {
      authUser: false,
      activeUser: this.props.navigation.getParam("id", null),
      test: 150,
      isLoading: true,
    };
    if (this.state.activeUser === null && this.props.AuthContext.user.id) {
      this.state = {
        ...this.state,
        authUser: true,
        activeUser: this.props.AuthContext.user.id,
      };
    }
    this.state.tabData = [];
    // console.log(this.state);
    this.loadUser();
  }

  async componentDidMount () {
    UserDB.on("updateUser", this.handleDataChange.bind(this));
    // setTimeout(() => { this.setState({test: 300}); }, 5000);
  }

  async componentWillUnmount () {
    UserDB.off("updateUser", this.handleDataChange.bind(this));
  }

  // static getDerivedStateFromProps (props, state) {

  // }

  /**
   * Retrieves a user's data from storage and applies it to tab data
   */
  async loadUser () {
    const record = await User.getUser({id: this.state.activeUser});
    // console.log(record);
    this.setState({userRecord: record});
    if (record.type === "Driver") {
      this.setState({tabData: [
        {header: "Vehicles",
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          // data: new Array(5000).fill(null),
          renderItem: (data) => <VehicleCard {...data}/>
        },
        {header: "Reviews",
          data: [1, 2, 3, 4, 5, 6, 7, 8],
          renderItem: ({item, index}) => <Card><CardItem><Text>Mechanic Review #{index}</Text></CardItem></Card>
        },
        {header: "Request History",
          data: [1, 2, 3],
          renderItem: ({item, index}) => <Card><CardItem><Text>Request history #{index}</Text></CardItem></Card>
        },

      ]
      });
    } else if (record.type === "Mechanic") {
      this.setState({tabData: [
        {header: "Reviews", data: []},
        {header: "Request History", data: []},
      ]
      });
    } else if (record.type === "Admin") {
      this.setState({tabData: [
        {header: "Approvals", data: []},
      ]
      });
    }
    this.setState({isLoading: false});
  }

  handleDataChange () {

  }

  _onHeaderScroll (value) {
    // console.log(value);
    if (value > 80) {
      this.setState({altHeader: true});
    } else {
      this.setState({altHeader: false});
    }
  }

  _renderProfileHeader (props) {
    return (
      <ProfileHeader height={this.state.test} {...props} record={this.state.userRecord}/>
    );
  }

  render () {
    // console.log(this.props);
    if (this.state.isLoading) {
      return (<View><Text>Loading</Text></View>);
    }
    return (
      <View style={{flex: 1}}>
        <HeaderBar withSection
          navRight={this.state.authUser
            ? <Button rounded small light onPress={() => this.props.navigation.navigate("EditProfileModal")}><Text style={{paddingHorizontal: 10}}>Edit Profile</Text></Button>
            : null}
          title={this.state.altHeader ? `${this.state.userRecord.fullName}` : null}
        />
        <StickyTabTemplate
          headerComponent={this._renderProfileHeader.bind(this)}
          tabData={this.state.tabData}
          renderItem={({item, index}) => <Card><CardItem><Text>Default render method user for item #{index}</Text></CardItem></Card>}
          onHeaderOffset={this._onHeaderScroll.bind(this)}
          renderEmpty={() => <Text style={{color: "lightgrey", fontWeight: "bold", fontSize: 16, textAlign: "center", paddingTop: 20}}>No items here...</Text>}
        />
      </View>
    );
  }
  _render () {
    return (
      <View>
        {withAuthContext(this._render)}
      </View>
    );
  }
}

export default withAuthContext(ProfileScreen);
