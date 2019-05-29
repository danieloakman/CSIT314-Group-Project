import React from "react";
import {
  View,
  Image
} from "react-native";

/**
 * Centers vertically and horizontally.
 */
export default class LoadingGif extends React.Component {
  render () {
    return (
      <View style={[{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center"
      }, this.props.containerStyle
      ]}>
        <Image
          source={require("@assets/images/loading.gif")}
          style={this.props.imageStyle}
        />
      </View>
    );
  }
}
