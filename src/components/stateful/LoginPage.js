/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
} from "react-native";
import { Button, Icon } from "native-base";
import * as en from "../../localization/en.json";
import * as helpers from "../../helpers";

export default class LoginPageComponent extends React.Component {
  state = {
    loginString: null,
    smsOtp: null,
    password: null,
    err: null,
  };

  async getPasswordFromSms() {
    return await helpers.getOtpFromSms();
  }

  authAndRedirect = async () => {
    const authInfo = {
      email: this.state.loginString,
      userName: this.state.loginString,
      number: this.state.loginString,
      password: this.state.password,
    };

    const { navigation, onAuthListener } = this.props;

    const resAuth = await onAuthListener(authInfo);

    if (resAuth.auth) navigation.navigate("ListenerPairUpScreen");
  };

  componentDidMount() {
    setTimeout(
      () => this.setState({ smsOtp: this.getPasswordFromSms() }),
      1500
    );
  }

  render() {
    const image = require("../../../assets/img/Flat-Mountains.png");
    return (
      <View style={styles.mainContainer}>
        <ImageBackground source={image} style={styles.bgImage}>
          <Text style={styles.headerText}>
            {en.listenerLoginPage.loginBlurb}
          </Text>
          <View style={styles.loginStringContainer}>
            <Text style={styles.stringText}>
              {en.listenerLoginPage.loginString}
            </Text>
            <TextInput
              style={styles.stringInput}
              autoCorrect={false}
              placeholder={en.listenerLoginPage.loginString}
              textContentType={"none"}
              onChangeText={(v) => this.setState({ loginString: v })}
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.passwordText}>
              {en.listenerLoginPage.password}
            </Text>
            <TextInput
              style={styles.passwordInput}
              autoCorrect={false}
              textContentType={"password"}
              placeholder={en.listenerLoginPage.password}
              value={this.state.smsOtp}
              onChangeText={(v) => this.setState({ password: v })}
            />
          </View>

          <Button
            style={styles.submitButton}
            iconLeft
            primary
            full
            onPress={() => this.authAndRedirect()}
          >
            <Icon style={styles.buttonIcon} type="FontAwesome" name="sign-in" />
            <Text style={styles.buttonText}>{en.landingPage.logIn}</Text>
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
  },
  passwordContainer: {
    flex: -1,
    width: "100%",
    height: "10%",
    marginTop: 10,
  },
  loginStringContainer: {
    flex: -1,
    width: "100%",
    height: "10%",
  },
  bgImage: { flex: 1, width: "100%", height: "100%" },
  headerText: {
    marginBottom: 60,
    marginTop: 15,
    marginLeft: 6,
    marginRight: 6,
    color: "#fff",
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#d9006a",
    flex: -1,
    fontFamily: "Eczar-SemiBold",
    fontSize: 14,
  },
  stringText: {
    fontFamily: "BioRhyme-ExtraLight",
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
  stringInput: {
    backgroundColor: "#f5eee4",
    borderRadius: 5,
    borderStartColor: "#000",
    borderStartWidth: 5,
    margin: 10,
  },
  passwordText: {
    fontFamily: "BioRhyme-ExtraLight",
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
  passwordInput: {
    backgroundColor: "#f5eee4",
    borderRadius: 5,
    borderStartColor: "#000",
    borderStartWidth: 5,
    margin: 10,
  },
  submitButton: {
    marginTop: 80,
    borderRadius: 5,
    borderRadius: 5,
    borderStartWidth: 5,
    margin: 10,
    padding: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontFamily: "PT_Sans-Web-Bold",
  },
});
