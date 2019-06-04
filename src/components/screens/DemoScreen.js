/* eslint-disable no-console */
import React from "react";
import BackButton from "@atoms/BackButton";
import {
  ScrollView,
  StyleSheet
} from "react-native";
import {
  Button,
  Toast,
  Text
} from "native-base";
// import DatabaseService from "@lib/services/DatabaseService";
import CoreDB from "@database/core";
import LocationService from "@lib/services/LocationService";
import {FileSystem} from "expo";
import PhoneNumberLink from "@components/atoms/PhoneNumberLink";
import DirectionsLink from "@components/atoms/DirectionsLink";

const authentication = require("../../../dataGenerator/datasets/authentication");
const cars = require("../../../dataGenerator/datasets/cars");
const descriptions = require("../../../dataGenerator/datasets/descriptions").description;
const locations = require("../../../dataGenerator/datasets/locations");
const names = require("../../../dataGenerator/datasets/names");
const phoneNumbers = require("../../../dataGenerator/datasets/phoneNumbers");
const uuid = require("uuid/v4");

/**
 * Gets a random location within kmRadius of one of the locations in locations.json.
 */
function getRandomLocationFromFile () {
  let loc = locations[Math.floor((Math.random() * locations.length - 1) + 1)];
  return LocationService.getRandomLocation(
    { latitude: loc.latitude, longitude: loc.longitude },
    loc.kmRadius
  );
}

export default class DemoScreen extends React.Component {
  static navigationOptions = {
    title: "DEMO UTILITIES SCREEN",
    headerLeft: BackButton,
    headerLeftContainerStyle: {
      paddingLeft: 15
    }
  };

  render () {
    return (
      <ScrollView style={{flex: 1}}>
        <Button full info
          style={styles.button}
          onPress={async () => {
            await CoreDB.wipeAll();
            console.log("Done wipe database. Should sign out now.");
            // todo: show toast, auto sign out
          }}
        >
          <Text>Wipe database</Text>
        </Button>
        <Button full info
          style={styles.button}
          onPress={async () => {
            await CoreDB.loadTestData({wipe: true});
            console.log("Done wipe database and re-initialise. Should sign out now.");
            // todo: show toast, auto sign out
          }}
        >
          <Text>Wipe and re-initialise database</Text>
        </Button>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 5,
    marginHorizontal: 5,
  }
});
