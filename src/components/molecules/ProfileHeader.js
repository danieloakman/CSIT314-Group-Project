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
    let {record} = this.props;
    return (

      <FlexContainer size={2} style={{
        justifyContent: "space-around",
        flexDirection: "column",
        backgroundColor: "#efefef",
      }} >
        {/* User image and name */}
        <FlexContainer size={2} style={{ justifyContent: "flex-start" }}>
          <Image
            source={record.pictureURI
              ? {uri: record.pictureURI}
              : require("@assets/images/robot-prod.png")}
            style={styles.userImage}
          />

          <Text style={styles.userName}>
            {record.firstName} {record.lastName}
          </Text>
        </FlexContainer>
        {/* User description */}
        <FlexContainer size={4} style={{ marginTop: 15 }}>
          <FlexContainer size={3} />
          <Text style={[{ flex: 2 }, styles.centerText]}>{record.description}</Text>
          <View style={{ flex: 4 }}>
            <Text style={styles.centerText}>Member since: {record.registerDate}</Text>
            <Text style={styles.centerText}/>
            <Text style={styles.centerText}>subscriberBadge if subscriber</Text>
          </View>

          <FlexContainer size={2} />
          {/* Open contact modal */}
        </FlexContainer>
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
    maxWidth: 75,
    maxHeight: 75,
    alignSelf: "center"
  },
});
