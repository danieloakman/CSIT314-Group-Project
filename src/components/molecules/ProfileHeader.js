import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";

import FlexContainer from "@components/FlexContainer";
import {withAuthContext} from "@lib/context/AuthContext";

class ProfileHeader extends React.Component {
  render () {
    let auth = this.props.AuthContext;
    return (

      <FlexContainer size={2} style={{
        justifyContent: "space-around",
        flexDirection: "column",
        // borderBottomColor: "#ddd",
        // borderBottomWidth: 1,
        // marginBottom: 15,
        backgroundColor: "#efefef",
      }} >
        {/* User image and name */}
        <FlexContainer size={2} style={{ justifyContent: "flex-start" }}>
          <Image
            source={auth.user.pictureURI
              ? {uri: auth.user.pictureURI}
              : require("@assets/images/robot-prod.png")}
            style={styles.userImage}
          />

          <Text style={styles.userName}>
            {auth.user.firstName} {auth.user.lastName}
          </Text>
        </FlexContainer>
        {/* User description */}
        <FlexContainer size={4} style={{ marginTop: 15 }}>
          <FlexContainer size={3} />
          <Text style={[{ flex: 2 }, styles.centerText]}>{auth.user.description}</Text>
          <View style={{ flex: 4 }}>
            <Text style={styles.centerText}>Member since: {auth.user.registerDate}</Text>
            <Text style={styles.centerText}/>
            <Text style={styles.centerText}>subscriberBadge if subscriber</Text>
          </View>

          <FlexContainer size={2} />
          {/* Open contact modal */}
        </FlexContainer>
        {/* <FlexContainer size={0.5} /> */}
      </FlexContainer>

    );
  }
}
export default withAuthContext(ProfileHeader);

const styles = StyleSheet.create({
  centerText: {
    alignSelf: "center",
    textAlign: "center",
  },
  userName: {
    fontSize: 24,
    alignSelf: "center",
    textAlign: "center",
  },
  userImage: {
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
    resizeMode: "cover",
    // flex: 1,
    maxWidth: 75,
    maxHeight: 75,
    alignSelf: "center"
  },
});
