/*
  A generic driverprofile component for rendering any driver's profile
  If it is the active driver's profile, it will display an edit button
*/
import React from "react";
import {
  Text,
  Alert,
  View
} from "react-native";

import {
  Body, List, ListItem as Item, ScrollableTab, Tab, Tabs, Title, Card, CardItem, Button
} from "native-base";

import FullWidthButton from "@atoms/FullWidthButton";
import DrawerButton from "@atoms/DrawerButton";
import ProfileHeader from "@molecules/ProfileHeader";
// import ProfilePage from "@templates/ProfileTemplate";
import HeaderBar from "@molecules/HeaderBar";
import WindowBox from "@components/WindowBox";
import {withAuthContext} from "@lib/context/AuthContext";
import { NavigationActions, withNavigation, Header } from "react-navigation";
import UserDB from "@lib/services/UserDatabaseService";
import StickyTabTemplate from "@templates/StickyTabTemplate";

/**
 * Takes a prop to define which profile to display
 * If it's the active user, extra options are given
 */
class ProfileScreen extends React.Component {
  // static navigationOptions = {
  // // static navigationOptions = ({navigation}) => {
  //   // return {
  //   title: "User Profile",
  //   headerTitle: "User Profile",
  //   headerLeft: DrawerButton,
  //   headerLeftContainerStyle: {
  //     paddingLeft: 15
  //   },
  //   // headerRight: this.props.email === this.props.AuthContext.user.email
  //   //   ? DrawerButton
  //   //   : DrawerButton
  //   // };
  // };

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
    console.log(this.state);
    this.loadUser();
  }

  async componentDidMount () {
    UserDB.emitter.on("updateUser", this.handleDataChange, this);
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
    // if (this.state.userRecord) {
    return (
      <ProfileHeader height={this.state.test} {...props} record={this.state.userRecord}/>
    );
    // } else {
    //   return (<View style={{height: 2}}></View>);
    // }
  }

  /*
    TODO:
    implement actual user profile
    replace user image and name with actual values at runtime
    Decompose into multiple components in order to include in mechanic profile as well

  */
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
          // headerHeight={this.state.test}
          headerComponent={this._renderProfileHeader.bind(this)}
          tabData={this.state.tabData}
          renderItem={({item, index}) => <Card><CardItem><Text>Default render method user for item #{index}</Text></CardItem></Card>}
          onHeaderOffset={this._onHeaderScroll.bind(this)}
        />

      </View>
    );
  }
  _render () {
    console.log(this.props);
    return (
      <View>
        {withAuthContext(this._render)}
      </View>
    );
  }
}
// export default DriverProfileScreen;
export default withAuthContext(ProfileScreen);
