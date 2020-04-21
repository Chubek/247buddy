/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import PropTypes from "prop-types";
import { Button, Container } from "native-base";
import * as en from "../../localization/en.json";
import * as helpers from "../../helpers";
import { authListener } from "../../modules/listener/ListenerState";
import { useNavigation } from "@react-navigation/native";

export default class LoginPageComponent extends Component {
  state = {
    loginString: null,
    smsOtp: null,
    password: null,
  };
  getPasswordFromSms() {
    return helpers.getOtpFromSms();
  }

  loginAndRedirect = async () => {
    const navigation = useNavigation();

    const authInfo = {
      email: this.state.loginString,
      userName: this.state.loginString,
      number: this.state.loginString,
      password: this.state.password,
      err: null,
    };

    const authRes = await authListener(authInfo);

    if (authRes.auth) {
      navigation.navigate("ListenerProfileScreen");
    } else {
      this.setState({
        err: "Login unsuccessful." + res,
      });
    }
  };

  componentDidMount() {
    setTimeout(
      () => this.setState({ smsOtp: this.getPasswordFromSms() }),
      1500
    );
  }

  render() {
    const image = require("../../../assets/img/Flat-Mountains.svg");
    return (
      <View style={styles.mainContainer}>
        <ImageBackground source={image} style={styles.bgImage}>
          <Text style={styles.headerText}>
            {en.listenerLoginPage.loginBlurb}
          </Text>
          <Container style={styles.stringContainer}>
            <Text style={styles.stringText}>
              {en.listenerLoginPage.loginString}
            </Text>
            <TextInput
              style={styles.stringInput}
              textContentType={"none"}
              onChangeText={(v) => this.setState({ loginString: v })}
            />
          </Container>

          <Container style={styles.passwordContainer}>
            <Text style={styles.passwordText}>
              {en.listenerLoginPage.password}
            </Text>
            <TextInput
              style={styles.passwordInput}
              textContentType={password}
              value={this.state.smsOtp}
              onChangeText={(v) => this.setState({ password: v })}
            />
          </Container>

          <Button
            style={styles.submitButton}
            iconLeft
            primary
            full
            onPress={this.loginAndRedirect()}
          >
            <Text stye={styles.error}> {this.state.er} </Text>
          </Button>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    back,
  },
});

LoginPageComponent.propTypes = {
  children: PropTypes.element.isRequired,
};
