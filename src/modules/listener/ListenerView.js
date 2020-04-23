/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */

import React, { Component } from "react";
import LoginPage from "../../components/stateful/LoginPage";
import RegisterPage from "../../components/stateful/RegisterPage";

export default class FirebaseAuthView extends Component {
  render() {
    const {
      onAuthListener,
      onRegisterListener,
      navigation,
      switcher,
    } = this.props;

    if (switcher === "login") {
      return (
        <LoginPage onAuthListener={onAuthListener} navigation={navigation} />
      );
    } else if (switcher === "register") {
      return (
        <RegisterPage
          onRegisterListener={onRegisterListener}
          navigation={navigation}
        />
      );
    }
    return false;
  }
}
