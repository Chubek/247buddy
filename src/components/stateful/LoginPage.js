/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import * as React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import {
  Container,
  Content,
  Footer,
  Button,
  Icon,
  Text,
  Input,
  Label,
  Form,
  Item,
} from "native-base";
import * as en from "../../localization/en.json";
import * as helpers from "../../helpers";

export default class LoginPageComponent extends React.Component {
  state = {
    loginString: null,
    smsOtp: "",
    password: null,
    err: null,
  };

  async getPasswordFromSms() {
    const otp = await helpers.getOtpFromSms();
    return otp === null || otp === "" ? "" : otp;
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
    console.log(
      `NOTE to Sethuraman: Currently, the returned OTP is ${this.getPasswordFromSms()}, hence the warning. Ignore it for now.`
    );
    setTimeout(
      () => this.setState({ smsOtp: this.getPasswordFromSms() }),
      1500
    );
  }

  render() {
    const image = require("../../../assets/img/Flat-Mountains.png");
    return (
      <Container style={styles.mainContainer}>
        <ImageBackground source={image} style={styles.bgImage}>
          <Content>
            <Form style={styles.form}>
              <Item style={styles.itemContainer} stackedLabel rounded>
                <Icon
                  style={styles.icon}
                  active
                  name="sign-in"
                  type="FontAwesome"
                />
                <Label>{en.listenerLoginPage.loginString}</Label>
                <Input
                  style={styles.input}
                  onChange={(v) => this.setState({ loginString: v })}
                />
              </Item>
              <Item style={styles.itemContainer} stackedLabel last rounded>
                <Icon
                  style={styles.icon}
                  active
                  name="ticket"
                  type="FontAwesome"
                />
                <Label>{en.listenerLoginPage.password}</Label>
                <Input
                  style={styles.input}
                  value={this.state.smsOtp}
                  onChange={(v) => this.setState({ password: v.text })}
                />
              </Item>
              <Button
                style={styles.submitButton}
                onPress={() => this.onAuthListener}
                rounded
                iconLeft
              >
                <Icon name="key" />
                <Text>{en.landingPage.logIn}</Text>
              </Button>
            </Form>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  form: {
    marginTop: 100,
  },
  itemContainer: {
    margin: 20,
  },
  icon: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#ff8",
  },
  submitButton: {
    marginTop: 10,
  },
  footer: {
    height: "8%",
    opacity: 30,
    backgroundColor: "#ff7",
  },
  bgImage: { flex: 1, width: "100%", height: "100%" },
});
