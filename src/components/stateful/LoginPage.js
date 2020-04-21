/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import * as React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Input,
  Label,
  Form,
} from "native-base";
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
      <Container style={styles.mainContainer}>
        <ImageBackground source={image} style={styles.bgImage}>
          <Header>
            <Left>
              <Icon name="arrow-right" />
              <Text>{en.listenerLoginPage.loginBlurb}</Text>
            </Left>
          </Header>
          <Content>
            <Body>
              <Form>
                <Item fixedLabel>
                  <Label>{en.listenerLoginPage.loginString}</Label>
                  <Input />
                </Item>
                <Item fixedLabel>
                  <Label>{en.listenerLoginPage.loginString}</Label>
                  <Item>
                    <Icon active name="sign-in" />
                    <Input
                      onChange={(v) => this.setState({ loginString: v })}
                    />
                  </Item>
                </Item>
                <Item fixedLabel>
                  <Label>{en.listenerLoginPage.password}</Label>
                  <Item>
                    <Icon active name="ticket" />
                    <Input
                      value={this.state.smsOtp}
                      onChange={(v) => this.setState({ password: v })}
                    />
                  </Item>
                </Item>
                <Button onPress={() => this.onAuthListener} iconLeft>
                  <Icon name="key" />
                  <Text>{en.landingPage.logIn}</Text>
                </Button>
              </Form>
            </Body>
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
