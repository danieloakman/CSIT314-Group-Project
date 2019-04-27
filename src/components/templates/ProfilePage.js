import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Alert
} from "react-native";

import FlexContainer from "@components/FlexContainer";
import FullWidthButton from "@atoms/FullWidthButton";
import DrawerButton from "@components/DrawerButton";
import ProfileHeader from "@molecules/ProfileHeader";

export default class ProfilePage extends React.Component {
  render () {
    return (
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
      }}>
        {this.props.header
          ? <this.props.header />
          : null
        }
        <FlexContainer size={1} style={{
          height: 900,

        }}>
          {this.props.children}
        </FlexContainer>

      </ScrollView>
    );
  }
}
