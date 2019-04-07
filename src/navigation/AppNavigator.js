import React from "react";
import { createAppContainer, createSwitchNavigator, createStackNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import SignInCreateAccScreen from "../screens/SignInCreateAccScreen";

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Auth: createStackNavigator({ SignIn: SignInCreateAccScreen }),
  Main: MainTabNavigator
}));
