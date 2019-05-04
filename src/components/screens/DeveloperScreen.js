// Only available in developer mode
import React from "react";

import BackButton from "@atoms/BackButton";
import {
  View,
  Button
} from "react-native";

export default class DeveloperScreen extends React.Component {
  static navigationOptions = {
    title: "DEV OPTIONS",
    headerLeft: BackButton,
    headerLeftContainerStyle: {
      paddingLeft: 15
    }
  };

  render () {
    return (
      <View style={{flex: 1}}>
        <Button
          title="Google maps test screen"
          onPress={async () => {
            this.props.navigation.navigate("GMapsTest");
          }}
        />
      </View>
    );
  }
}
