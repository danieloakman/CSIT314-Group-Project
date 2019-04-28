import React from "react";

import {darkTheme} from "@constants/ThemeDark";
import {lightTheme} from "@constants/ThemeLight";

export const ThemeContext = React.createContext();

export class ThemeProvider extends React.Component {
  state = {
    theme: lightTheme
  }

  switchTheme (dark) {
    if (dark) {
      this.setState({theme: darkTheme});
    } else {
      this.setState({theme: lightTheme});
    }
  }
  render () {
    return (
      <ThemeContext.Provider value={{
        theme: this.state.theme,
        switchTheme: this.switchTheme.bind(this)
      }}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export class ThemeConsumer extends React.Component {
  render () {
    return (
      <ThemeContext.Consumer>
        {this.props.children}
      </ThemeContext.Consumer>
    );
  }
}

/**
 * Higher order component that returns a component wrapped with a Theme context consumer
 */
export const withTheme = Component => {
  // Returns a function which is a component
  return props => {
    return (
      <ThemeContext.Consumer>
        {(context) => <Component {...props} ThemeContext={context} />}
      </ThemeContext.Consumer>
    );
  };
};
