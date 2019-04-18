// import React from "react";
import { createAppContainer, createSwitchNavigator, createStackNavigator } from "react-navigation";

import DrawerNavigator from "./DrawerNavigator";
import SignInCreateAccScreen from "../screens/SignInCreateAccScreen";
import GMapsTestScreen from "../screens/GMapsTestScreen.js";

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Auth: createStackNavigator({ SignIn: SignInCreateAccScreen }),
  Main: DrawerNavigator,
  GMapsTest: createStackNavigator({ GMapsTest: GMapsTestScreen })
}));
