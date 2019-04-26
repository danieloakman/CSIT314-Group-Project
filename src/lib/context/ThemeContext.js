import React from "react";

import {darkTheme} from "@constants/ThemeDark";
import {lightTheme} from "@constants/ThemeLight";

export const ThemeContext = React.createContext();

export class ThemeProvider extends React.Component {
  state = {
    theme: lightTheme,
    switchTheme: (dark) => {
      if (dark) {
        this.theme = darkTheme;
      } else {
        this.theme = lightTheme;
      }
    }
  }
  render () {
    return (
      <ThemeContext.Provider value={this.state}>
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
