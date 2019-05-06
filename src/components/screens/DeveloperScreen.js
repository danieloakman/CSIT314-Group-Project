/* eslint-disable no-console */
// Only available in developer mode
import React from "react";

import BackButton from "@atoms/BackButton";
import {
  View,
  Button
} from "react-native";
import DatabaseService from "@lib/services/DatabaseService";

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
          style={{margin: 5}}
          title="Google maps test screen"
          onPress={async () => {
            this.props.navigation.navigate("GMapsTest");
          }}
        />
        <Button
          title="Console log all keys in database"
          onPress={async () => {
            await DatabaseService.printAllKeysInDatabase();
          }}
        />
        <Button
          title="Get vehicle"
          onPress={async () => {
            let user = await DatabaseService.getSignedInUser();
            let id = user.vehicleIds[0];
            console.log(
              `vehicle-${id}: ` +
              JSON.stringify(await DatabaseService.getVehicle(id))
            );
          }}
        />
        <Button
          title="Wipe and re-initialise database"
          onPress={async () => {
            await DatabaseService.initialiseDatabase(
              {forceWipe: true, mergeDatabaseFile: false}
            );
            console.log("Done wipe database.");
          }}
        />
        <Button
          title="Merge testData.json into database"
          onPress={async () => {
            await DatabaseService.initialiseDatabase(
              {forceWipe: false, mergeDatabaseFile: true}
            );
            console.log("Done merge database.");
          }}
        />
      </View>
    );
  }
}
