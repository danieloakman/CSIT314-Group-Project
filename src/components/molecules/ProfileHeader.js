import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";

import FlexContainer from "@components/FlexContainer";
import StarRating from "react-native-star-rating";
import {withAuthContext} from "@lib/context/AuthContext";
import {month} from "@constants/common";
import { Thumbnail } from "native-base";
import PhoneLink from "@atoms/PhoneNumberLink";
import { Ionicons } from "@expo/vector-icons";

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
          <Thumbnail circle large source={
            record.pictureURI
              ? {uri: record.pictureURI}
              : require("@assets/images/placeholder-user.png")}
          style={styles.userImage}
          />

          <View style={{flex: 1, alignSelf: "center", alignItems: "center"}}>
            <View>
              <Text style={styles.userName}>
                {record.fullName}
              </Text>
              <Text style={styles.userEmail}>
                {record.email}
              </Text>
              {record.phoneNo &&
                <View style={{flexDirection: "row"}}>
                  <PhoneLink phoneNo={record.phoneNo} style={{color: "#47f"}} />
                  <Text>  </Text>
                  <Ionicons name="md-arrow-forward" size={23} color="#47f" />
                </View>
              }
            </View>

          </View>

        </FlexContainer>
        {/* User description */}
        <FlexContainer size={4} style={{ marginTop: 15 }}>
          <View style={{flex: 1, alignSelf: "center", alignItems: "flex-start", minWidth: 150}}>

            {record.desciption !== "" && record.description !== null &&
              <Text style={[{ flex: 2 }, styles.centerText]}>{record.description}</Text>
            }

            <Text >Joined {month[record.creationDate.getUTCMonth()]} {record.creationDate.getUTCFullYear()}</Text>
            {record.type === "Driver" && record.isMember
              ? <Text style={styles.memberBadge}>Member</Text>
              : null
            }
            {record.type === "Mechanic"
              ? <View style={{paddingTop: 8}}><StarRating
                disabled={true}
                maxStars={5}
                rating={record.averageRating / 2}
                iconSet="Ionicons"
                emptyStar="ios-star-outline"
                halfStar="ios-star-half"
                fullStar="ios-star"
                starSize={30}
              /></View>
              : null
            }
            {record.type === "Mechanic"
              ? <Text>Ratings: {record.ratingCount}</Text>
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
    marginTop: 10,
    resizeMode: "cover",
    width: 75,
    height: 75,
    alignSelf: "center"
  },
  memberBadge: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    backgroundColor: "#0eadf7",
    marginTop: 20,
    padding: 2,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 8,
    // borderColor: "#f2c915",
    // borderWidth: 2
  }
});
