/* eslint-disable no-console */
// Only available in developer mode
import React from "react";

import BackButton from "@atoms/BackButton";
import {
  ScrollView,
  Button
} from "react-native";
import DatabaseService from "@lib/services/DatabaseService";
import LocationService from "@lib/services/LocationService";
import {FileSystem} from "expo";
const cars = require("../../../dataGenerator/datasets/cars");
const names = require("../../../dataGenerator/datasets/names");
const uuid = require("uuid/v4");

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
      <ScrollView style={{flex: 1}}>
        <Button
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
          title="Wipe and re-initialise database"
          onPress={async () => {
            await DatabaseService.initialiseDatabase({forceWipe: true});
            console.log("Done wipe database. Should sign out now.");
          }}
        />
        <Button
          title="Merge testData.json into database"
          onPress={async () => {
            await DatabaseService.initialiseDatabase({forceWipe: false});
            console.log("Done merge database. Should sign out now.");
          }}
        />
        <Button
          title="Console log all signed in user's vehicles"
          onPress={async () => {
            let user = await DatabaseService.getSignedInUser();
            await Promise.all(user.vehicleIds.map(id => {
              return new Promise(async resolve => {
                console.log(
                  ` * vehicle-${id}: ` +
                  JSON.stringify(await DatabaseService.getVehicle(id))
                );
                resolve(true);
              });
            }));
          }}
        />
        <Button
          title="Add random vehicle to signed in user"
          onPress={async () => {
            let vehicle = cars[Math.floor((Math.random() * cars.length - 1) + 1)];
            let user = await DatabaseService.getSignedInUser();
            let result = await DatabaseService.createVehicle(
              user.email, vehicle.make, vehicle.model,
              vehicle.year, vehicle.plate, vehicle.vin
            );
            if (!result.pass && !result.vehicleId) {
              console.log("Failed createVehicle()");
              return;
            }
            user.vehicleIds.push(result.vehicleId);
            await DatabaseService.saveUserChanges(user);
            console.log("Done adding random vehicle.");
          }}
        />
        <Button
          title="Console log distance between two points"
          onPress={async () => {
            console.log(LocationService.getDistanceBetween(
              (await LocationService.getCurrentLocation()).coords,
              {latitude: -34.402001, longitude: 150.897785}
            ) + "km");
          }}
        />
        <Button
          title="Console log random location(s) around me"
          onPress={async () => {
            let location = await LocationService.getCurrentLocation();
            const numberOfLocations = 3;
            for (let i = 0; i < numberOfLocations; i++) {
              console.log(
                `${i}: ` +
                JSON.stringify(LocationService.getRandomLocation(location.coords, 50), null, 2)
              );
            }
          }}
        />
        <Button
          title="Console log all SRs near me"
          onPress={async () => {
            let location = await LocationService.getCurrentLocation();
            let srArr = await DatabaseService.getAllSRsNearLocation(50, location);
            console.log("srArr: " + JSON.stringify(srArr, null, 2));
          }}
        />
        <Button
          title="Console log current location"
          onPress={async () => {
            console.log("Retrieving current location...");
            console.log("Current location: " + JSON.stringify(await LocationService.getCurrentLocation(), null, 2));
          }}
        />
        <Button
          title="Simulate a bunch of async actions"
          onPress={async () => {
            let startTime = new Date();
            // let currentLocation = await LocationService.getCurrentLocation();
            const totalActions = 1000;
            const noOfAsyncActions = 50;
            for (let i = 0; i < totalActions; i += noOfAsyncActions) {
              let promises = [];
              for (let j = 0; j < noOfAsyncActions; j++) {
                promises.push(new Promise(async resolve => {
                  try {
                    // Create driver:
                    let firstName = names.firstNames[Math.floor((Math.random() * names.firstNames.length - 1) + 1)];
                    let lastName = names.lastNames[Math.floor((Math.random() * names.lastNames.length - 1) + 1)];
                    let email = `${uuid()}email@test.com`;
                    await DatabaseService.createUser(
                      "Driver", firstName, lastName, email, "test123", "04123456718"
                    );
                    let user = await DatabaseService.getUser(email);

                    // Driver adds a car:
                    let vehicle = cars[Math.floor((Math.random() * cars.length - 1) + 1)];
                    let result = await DatabaseService.createVehicle(
                      user.email, vehicle.make, vehicle.model,
                      vehicle.year, vehicle.plate, vehicle.vin
                    );

                    // Update driver with car id:
                    user.vehicleIds.push(result.vehicleId);
                    await DatabaseService.saveUserChanges(user);

                    // Get vehicle from DB after it's been created:
                    vehicle = await DatabaseService.getVehicle(user.vehicleIds[0]);

                    // Driver creates service request:
                    result = await DatabaseService.createServiceRequest(
                      LocationService.getRandomLocation(
                        {latitude: -34.406419, longitude: 150.882327}, 5),
                      user.email, vehicle.id, `Random description-${uuid()}`
                    );

                    // Save Driver and service request changes:
                    user.srId = vehicle.srId = result.srId;
                    await Promise.all([
                      DatabaseService.saveUserChanges(user),
                      DatabaseService.saveVehicleChanges(vehicle)
                    ]);
                  } catch (err) {
                    console.log(`error: ${err.message}`);
                  }
                  resolve(true);
                }));
              }
              console.log(`Started actions ${i} to ${i + noOfAsyncActions}`);
              await Promise.all(promises);
              console.log(`Completed actions ${i} to ${i + noOfAsyncActions}`);
            }
            let runTime = new Date() - startTime;
            console.log(
              `Completed in: ${runTime}ms\n` +
              `Mean run time: ${runTime / totalActions}ms`
            );
          }}
        />
        <Button
          title="Navigate to test driver 1"
          onPress={async () => {
            this.props.navigation.push("ProfileModal", {email: "driver@test.com"});
          }}
        />
        <Button
          title="Navigate to test driver 2"
          onPress={async () => {
            this.props.navigation.push("ProfileModal", {email: "driver2@test.com"});
          }}
        />
        <Button
          title="Navigate to test mechanic"
          onPress={async () => {
            this.props.navigation.push("ProfileModal", {email: "mechanic@test.com"});
          }}
        />
        <Button
          title="Navigate to test admin"
          onPress={async () => {
            this.props.navigation.push("ProfileModal", {email: "admin@test.com"});
          }}
        />
      </ScrollView>
    );
  }
}
