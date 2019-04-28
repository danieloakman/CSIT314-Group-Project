// Only available in developer mode
import React from "react";
import { ExpoConfigView } from "@expo/samples";

import BackButton from "@atoms/BackButton";

export default class ExpoSettingsScreen extends React.Component {
  static navigationOptions = {
    title: "app.json",
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
