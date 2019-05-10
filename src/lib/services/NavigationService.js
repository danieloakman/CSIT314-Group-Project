import { NavigationActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator (navRef) {
  _navigator = navRef;
}

function navigate (routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
};
