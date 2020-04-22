/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */

import React, { Component } from "react";
import LoginPage from "../../components/stateful/LoginPage";

export default class FirebaseAuthView extends Component {
  componentWillMount() {}

  render() {
    const { onAuthListener, navigation, switcher } = this.props;
    
    if (switcher === "login") {
      return (
        <LoginPage onAuthListener={onAuthListener} navigation={navigation} />
      );
    }
    return false;
  }
}
