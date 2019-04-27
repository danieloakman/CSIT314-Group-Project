import React from "react";
import {
  ScrollView,
} from "react-native";

import FlexContainer from "@components/FlexContainer";

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
