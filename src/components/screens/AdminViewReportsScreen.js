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
import DatabaseService from "@lib/services/DatabaseService";
import HelpButton from "@atoms/HelpButton";

class AdminViewReportsScreen extends React.Component {
  state = {
    serviceRequests: [],
    payments: []
  };

  componentDidMount () {
    //
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <HeaderBar title="View Reports"/>
        <Tabs locked
          tabStyle={{backgroundColor: "blue"}}
        // activeTabStyle={{backgroundColor: "blue"}}
        >
          <Tab heading="Service Request Report"
            activeTabStyle={{backgroundColor: "grey"}}
            tabStyle={{backgroundColor: "grey"}}
          >
            <ScrollView>
            </ScrollView>
          </Tab>
          <Tab heading="Payment Report"
            activeTabStyle={{backgroundColor: "grey"}}
            tabStyle={{backgroundColor: "grey"}}
          >
            <ScrollView>
            </ScrollView>
          </Tab>
          {/* <Tab heading="Other Report"
            activeTabStyle={{backgroundColor: "grey"}}
            tabStyle={{backgroundColor: "grey"}}
          >
            <ScrollView>
            </ScrollView>
          </Tab> */}
        </Tabs>
      </View>
    );
  }
}

export default withNavigation(AdminViewReportsScreen);
