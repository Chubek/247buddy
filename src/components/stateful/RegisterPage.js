/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  Input,
  Label,
  Form,
  Item,
  StyleProvider,
  Right,
  Left,
} from "native-base";
import * as helpers from "../../helpers/";
import * as en from "../../localization/en.json";
import getTheme from "~/native-base-theme/components/";
import commonColor from "~/native-base-theme/variables/commonColor";

export default class LoginPageComponent extends Component {
  state = {
    userName: "",
    email: "",
    number: "",
    categories: [],
    numberErr: "",
    countryCode: "",
    receivedNumber: "",
    valid: false,
  };

  getNumberAndCountryCode = async () => {
    const numberRes = await helpers.getNumberAndCountryCode();

    if (numberRes) {
      this.setState({
        receivedNumber: numberRes.phoneNumber,
        countryCode: numberRes.countryCode,
      });

      if (!/91/.test(numberRes.countryCode)) {
        this.setState({ numberErr: en.registerPage.numberErr, valid: false });
      }
    }
  };

  onRegisterUser = async () => {
    const registerInfo = {
      userName: this.state.userName,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      categories: this.state.categories,
    };

    const { navigation, onRegisterListener } = this.props;

    const registerRes = await onRegisterListener(registerInfo);

    if (registerRes.registered) {
      navigation.navigate("LoginScreen");
    }
  };

  onValidatePhoneNumber = (v) => {
    const pattern = / ^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$ /;
    if (pattern.test(v)) {
      this.setState({ valid: true });
    } else {
      this.setState({ valid: false, numberErr: en.registerPage.numberErr });
    }
  };

  render() {
    const backgroundImage = require("../../../assets/img/register-bg.png");
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container style={styles.mainContainer}>
          <ImageBackground source={backgroundImage} style={styles.bgImage}>
            <Content>
              <Form style={styles.form}>
                <Content>
                  <Item style={styles.itemContainer} stackedLabel>
                    <Icon
                      style={styles.icon}
                      active
                      name="snowflake-o"
                      type="FontAwesome"
                    />
                    <Label style={styles.label}>
                      {en.registerPage.userName}
                    </Label>
                    <Input onChange={(v) => this.setState({ userName: v })} />
                  </Item>
                </Content>
                <Content>
                  <Item style={styles.itemContainer} stackedLabel>
                    <Icon
                      style={styles.icon}
                      active
                      name="envelope"
                      type="FontAwesome"
                    />
                    <Label style={styles.label}>{en.registerPage.email}</Label>
                    <Input onChange={(v) => this.setState({ email: v })} />
                  </Item>
                </Content>
                <Content
                  style={styles.itemContainer}
                  style={styles.phoneNumberInput}
                >
                  <Item stackedLabel>
                    <Icon
                      style={styles.icon}
                      active
                      name="device-mobile"
                      type="Octicons"
                    />
                    <Label style={styles.label}>
                      {en.registerPage.phoneNumber}
                    </Label>
                  </Item>

                  <TouchableHighlight
                    style={styles.phoneNumberHighlight}
                    onPress={() => {
                      this.getNumberAndCountryCode();
                    }}
                    underlayColor="transparent"
                  >
                    <Icon type="FontAwesome" name="bullseye" />
                  </TouchableHighlight>
                </Content>

                <Button
                  style={styles.submitButton}
                  onPress={() => this.onRegisterUser()}
                  rounded
                  iconLeft
                  warning
                >
                  <Icon type="FontAwesome" name="user-plus" />
                  <Text>{en.registerPage.register}</Text>
                </Button>
              </Form>
            </Content>
          </ImageBackground>
        </Container>
      </StyleProvider>
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
    marginLeft: 10,
    marginRight: 10,
  },
  itemContainer: {
    margin: 20,
  },
  icon: {
    color: "#F3FFBD",
    marginLeft: 25,
  },
  input: {
    color: "#fff",
    borderBottomWidth: 20,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: "#D1B3C4",
  },
  label: {
    color: "#582630",
    textShadowColor: "#F1A66A",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 13,
  },
  bgImage: { flex: 1, width: "100%", height: "100%" },
  logo: {
    resizeMode: "contain",
    width: "80%",
    height: "80%",
    marginLeft: 20,
    marginTop: -10,
  },
  phoneNumberInput: {
    flex: 1,
    flexDirection: "row",
    
  },
  phoneNumberHighlight: {
    flex: -1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: -27,
    marginLeft: "90%",
  },
  bullseye: {
    marginLeft: -25,
    fontSize: 40,
  },
});
