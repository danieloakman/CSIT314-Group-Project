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

      <FlexContainer size={1} style={{
        justifyContent: "space-around",
        flexDirection: "column",
        backgroundColor: "#efefef",
        paddingBottom: 2
      }} >
        {/* User image and name */}
        <FlexContainer size={1} style={{ justifyContent: "flex-start" }}>
          <Image
            source={record.pictureURI
              ? {uri: record.pictureURI}
              : require("@assets/images/robot-prod.png")}
            style={styles.userImage}
          />
          <View style={{flex: 1, alignSelf: "center", alignItems: "center"}}>
            <View>
              <Text style={styles.userName}>
                {record.firstName} {record.lastName}
              </Text>
              <Text style={styles.userEmail}>
                {record.email}
              </Text>
            </View>

          </View>

        </FlexContainer>
        {/* User description */}
        <FlexContainer size={4} style={{ marginTop: 15 }}>
          <View style={{flex: 1, alignSelf: "center", alignItems: "flex-start", minWidth: 150}}>
            <Text style={[{ flex: 2 }, styles.centerText]}>{record.description}</Text>
            <Text >Joined date {record.registerDate}</Text>
            {record.type === "driver"
              ? <Text>Subscriber Badge</Text>
              : null
            }
            {record.type === "mechanic"
              ? <Text>Rating goes here</Text>
              : null
            }
          </View>
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
  userEmail: {
    fontSize: 12,
    color: "grey"
  },
  userImage: {
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
    resizeMode: "cover",
    // maxWidth: 75,
    // maxHeight: 75,
    width: 75,
    height: 75,
    alignSelf: "center"
  },
});
