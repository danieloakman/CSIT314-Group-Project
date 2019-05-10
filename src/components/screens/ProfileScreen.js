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

import {withAuthContext} from "@lib/context/AuthContext";

import UserDB from "@lib/services/UserDatabaseService";
import StickyTabTemplate from "@templates/StickyTabTemplate";

/**
 * Takes a prop to define which profile to display
 * If it's the active user, extra options are given
 */
class ProfileScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      authUser: false,
      activeUser: this.props.navigation.getParam("email", null),
      test: 150,
      isLoading: true,
    };
    if (this.state.activeUser === null && this.props.AuthContext.user.email) {
      this.state = {
        ...this.state,
        authUser: true,
        activeUser: this.props.AuthContext.user.email,
      };
    }
    this.state.tabData = [];
    // console.log(this.state);
    this.loadUser();
  }

  async componentDidMount () {
    UserDB.emitter.on("updateUser", this.handleDataChange, this);
    // setTimeout(() => { this.setState({test: 300}); }, 5000);
  }

  async componentWillUnmount () {
    UserDB.emitter.off("updateUser", this.handleDataChange, this);
  }

  // static getDerivedStateFromProps (props, state) {

  // }

  /**
   * Retrieves a user's data from storage and applies it to tab data
   */
  async loadUser () {
    const record = await UserDB.getUser(this.state.activeUser);
    // console.log(record);
    this.setState({userRecord: record});
    if (record.type === "driver") {
      this.setState({tabData: [
        {header: "Vehicles",
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          renderItem: ({item, index}) => <Card><CardItem><Text>Car card #{index} will go here</Text></CardItem></Card>
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
    } else if (record.type === "mechanic") {
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
          navRight={this.state.authUser ? <Button rounded small light><Text style={{paddingHorizontal: 10}}>Edit Profile</Text></Button> : null}
          title={this.state.altHeader ? `${this.state.userRecord.firstName} ${this.state.userRecord.lastName}` : null}
        />
        <StickyTabTemplate
          headerComponent={this._renderProfileHeader.bind(this)}
          tabData={this.state.tabData}
          renderItem={({item, index}) => <Card><CardItem><Text>Default render method user for item #{index}</Text></CardItem></Card>}
          onHeaderOffset={this._onHeaderScroll.bind(this)}
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
