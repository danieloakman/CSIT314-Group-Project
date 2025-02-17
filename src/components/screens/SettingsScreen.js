import React from "react";
import { ExpoConfigView } from "@expo/samples";

import BackButton from "@atoms/BackButton";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings",
    headerLeft: BackButton,
    headerLeftContainerStyle: {
      paddingLeft: 15
    }
  };

  render () {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <ExpoConfigView />;
  }
}
