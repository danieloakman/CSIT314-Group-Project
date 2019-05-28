import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Picker,
  Image
} from "react-native";
import {
  Button,
  Text
} from "native-base";
import {withNavigation} from "react-navigation";
import HeaderBar from "@molecules/HeaderBar";

class AdminScreen extends React.Component {
  render () {
    let user = this.props.AuthContext.user;
    return (
      <View style={{flex: 1}}>
        <HeaderBar
          navMid={<Text style={styles.heading}>Admin Home Screen</Text>}
          navRight={<View/>} // Just to center the heading
        />
        {user &&
          <View style={{flex: 1}}>
            <View style={styles.centeredRowContainer}>
              <Image
                source={require("@assets/images/car-broken-down.png")}
                style={[styles.iconImage, {height: 150, width: 150}]}
              />
              <View>
                <Text>Account Type: Admin</Text>
                <Text>Name: {user.firstName} {user.lastName}</Text>
              </View>
            </View>
            {/* <View style={styles.buttonContainer}>
              <Button full info // todo maybe: make it so admin can edit any user's profile through the EditProfileModal
                style={styles.button}
                onPress={() => this.props.navigation.navigate("EditProfileModal", {user: user.email}) }
              >
                <Text>Edit Profile</Text>
              </Button>
            </View> */}
            {/* <View style={styles.buttonContainer}>
              <Button full info // Can probably just put this in the profile screen.
                style={styles.button}
                onPress={() => this.props.navigation.navigate("HistoryList") }
              >
                <Text style={{fontSize: 16}}>Verification Request History</Text>
              </Button>
            </View> */}
            <View style={styles.buttonContainer}>
              <Button full info
                style={styles.button}
                onPress={() => this.props.navigation.navigate("AdminVerificationModal", {user}) }
              >
                <Text style={{fontSize: 16}}>View Mechanic Verification Requests</Text>
              </Button>
            </View>
          </View>}
      </View>
    );
  }
}

export default withNavigation(AdminScreen);

// class HistoryList extends React.Component {
//   render () {
//     return (
//       <ScrollView>
//         <Text style={styles.heading}>Verification History</Text>
//         <TouchableOpacity style={styles.buttonBox} onPress={() => this._viewHistoryItem()}>
//           <View style={styles.buttonBoxText}>
//             <Text>Date: </Text>
//             <Text>Time: </Text>
//             <Text>ID: </Text>
//           </View>
//         </TouchableOpacity>
//         <View style={styles.buttonContainer}>
//           <Button full info
//             style={styles.button}
//             title="Back"
//             onPress={() => this.props.navigation.goBack()}
//           >
//             <Text></Text>
//           </Button>
//         </View>
//       </ScrollView>
//     );
//   }
//   _viewHistoryItem () {
//     // need to get item information and give it to the history item screen
//     this.props.navigation.navigate("HistoryItem");
//   }
// }

// class HistoryItem extends React.Component {
//   render () {
//     return (
//       <View>
//         <Text style={styles.heading}>Verification History</Text>
//         <Text>Date: </Text>
//         <Text>Time: </Text>
//         <Text>Mechanic: </Text>
//         <Text>Approval: </Text>
//         <Text>ID: </Text>
//         <View style={styles.buttonContainer}>
//           <Button full info
//             style={styles.button}
//             title="Back"
//             onPress={() => this.props.navigation.goBack()}
//           >
//             <Text></Text>
//           </Button>
//         </View>
//       </View>
//     );
//   }
// }

// class SearchUser extends React.Component {
//   state = {
//     selectedType: "Any",
//     firstName: "",
//     lastName: "",
//     email: ""
//   }
//   render () {
//     return (
//       <View>
//         <Text style={styles.heading}>Search User</Text>
//         <View style={styles.centeredRowContainer}>
//           <Text style={styles.textBesideInput}>Type:</Text>
//           <View style={{borderWidth: 1, borderRadius: 5}}>
//             <Picker
//               selectedValue={this.state.selectedType}
//               style={{width: 150}}
//               itemStyle={{fontSize: 20}}
//               mode="dropdown"
//               onValueChange={selectedType => this.setState({ selectedType })}>
//               <Picker.Item label="Any" value="Any" />
//               <Picker.Item label="Mechanic" value="Mechanic" />
//               <Picker.Item label="Driver" value="Driver" />
//             </Picker>
//           </View>
//         </View>
//         <View style={styles.centeredRowContainer}>
//           <Text style={styles.textBesideInput}>Given Name:</Text>
//           <TextInput
//             style={styles.textInput}
//             onChangeText={firstName => this.setState({ firstName })}
//           />
//         </View>
//         <View style={styles.centeredRowContainer}>
//           <Text style={styles.textBesideInput}>Surname:</Text>
//           <TextInput
//             style={styles.textInput}
//             onChangeText={lastName => this.setState({ lastName })}
//           />
//         </View>
//         <View style={styles.centeredRowContainer}>
//           <Text style={styles.textBesideInput}>E-mail:</Text>
//           <TextInput
//             style={styles.textInput}
//             onChangeText={email => this.setState({ email })}
//           />
//         </View>
//         <View style={styles.buttonContainer}>
//           <Button full info
//             style={styles.button}
//             title="Search"
//             onPress={() => this._search()}
//           >
//             <Text></Text>
//           </Button>
//         </View>
//         <View style={styles.buttonContainer}>
//           <Button full info
//             style={styles.button}
//             title="Back"
//             onPress={() => this.props.navigation.goBack()}
//           >
//             <Text></Text>
//           </Button>
//         </View>
//       </View>
//     );
//   }
//   _search () {
//     this.props.navigation.navigate("SearchResults");
//   }
// }

// class SearchResults extends React.Component {
//   render () {
//     return (
//       <View>
//         <ScrollView>
//           <Text style={styles.heading}>Verification Requests</Text>
//           <TouchableOpacity style={styles.buttonBox} onPress={() => this._viewProfile()}>
//             <View style={styles.buttonBoxText}>
//               <Text>Name: </Text>
//               <Text>E-mail: </Text>
//               <Text>Type: </Text>
//             </View>
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             <Button full info
//               style={styles.button}
//               title="Back"
//               onPress={() => this.props.navigation.goBack()}
//             >
//               <Text></Text>
//             </Button>
//           </View>
//         </ScrollView>
//       </View>
//     );
//   }
//   _viewProfile () {
//     Alert.alert("view profile... again");
//   }
// }

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "center"
  },
  background: {
    backgroundColor: "black",
    width: 100,
    height: 100
  },
  buttonContainer: {
    // flex: 1,
    height: 100,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 2,
    marginBottom: 2
  },
  button: {
    flex: 1,
    borderRadius: 10
  },
  textBesideInput: {
    fontSize: 20
  },
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 5,
    width: "60%",
    paddingLeft: 5,
    backgroundColor: "white"
  },
  wideButtonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  wideButton: {
    // backgroundColor: Colors.wideButton,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5
  },
  centeredRowContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20
  },
  textBox: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 5,
    width: "90%",
    paddingLeft: 5,
    backgroundColor: "white",
    marginBottom: 5,
    alignSelf: "center"
  },
  buttonBox: {
    alignSelf: "center",
    backgroundColor: "yellow",
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 2,
    marginBottom: 2
  },
  buttonBoxText: {
    justifyContent: "center",
    padding: 10,
    fontSize: 20
  }
});
