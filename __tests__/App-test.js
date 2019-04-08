import "react-native";
import React from "react";
import {AppTest} from "../src/App";
import renderer from "react-test-renderer";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";

describe("App snapshot", () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it("renders the loading screen", async () => {
    const tree = renderer.create(<AppTest />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders the root without loading screen", async () => {
    const tree = renderer.create(<AppTest skipLoadingScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
