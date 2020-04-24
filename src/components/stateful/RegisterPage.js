/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import React, { Component } from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import {
  Tooltip,
  Icon,
  Input,
  Image,
  Text,
  Button,
} from "react-native-elements";
import * as helpers from "../../helpers/";
import * as en from "../../localization/en.json";
const backgroundImage = require("../../../assets/img/gradient-1.png");

export default class LoginPageComponent extends Component {
  state = {
    userName: "",
    email: "",
    number: "",
    categories: [],
    numberErr: "",
    receivedNumber: "",
    valid: false,
  };

  getNumber = async () => {
    const numberRes = await helpers.getNumber();

    if (numberRes) {
      this.setState({
        receivedNumber: numberRes,
      });
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
    return (
      <ImageBackground source={backgroundImage} style={styles.bgImage}>
        <Grid>
          <Row size={30} style={styles.inputField}>
            <Col size={90}>
              <Input
                leftIcon={{ type: "font-awesome", name: "user" }}
                label={en.registerPage.userName}
                onChange={(v) => this.setState({ userName: v })}
              />
            </Col>
            <Col size={10}>
              <Tooltip
                popover={<Text>{en.listenerLoginPage.userNameInfo}</Text>}
              >
                <Icon name="question-circle" type="font-awesome" color="#f80" />
              </Tooltip>
            </Col>
          </Row>
          <Row size={30} style={styles.inputField}>
            <Col size={90}>
              <Input
                leftIcon={{ type: "font-awesome", name: "envelope" }}
                label={en.registerPage.email}
                onChange={(v) => this.setState({ email: v })}
              />
            </Col>
            <Col size={10}>
              <Tooltip popover={<Text>{en.listenerLoginPage.emailInfo}</Text>}>
                <Icon name="question-circle" type="font-awesome" color="#f80" />
              </Tooltip>
            </Col>
          </Row>
          <Row size={30} style={styles.inputField}>
            <Col size={80}>
              <Input
                leftIcon={{ type: "font-awesome", name: "mobile" }}
                label={en.registerPage.phoneNumber}
                onChange={(v) => {
                  this.onValidatePhoneNumber(v);
                  this.setState({ phoneNumber: v });
                }}
              />
            </Col>
            <Col size={10}>
              <Icon
                type="font-awesome"
                name="bullseye"
                onPress={this.getNumber()}
                color="#f92"
              />
            </Col>
            <Col size={10}>
              <Tooltip popover={<Text>{en.listenerLoginPage.numberInfo}</Text>}>
                <Icon name="question-circle" type="font-awesome" color="#f80" />
              </Tooltip>
            </Col>
          </Row>
          <Row size={70}>
            <Col size={90}>
              <Button
                icon={{
                  type: "font-awesome",
                  name: "user-plus",
                  color: "white",
                }}
                title={en.registerPage.register}
                onPress={() => this.onRegisterUser()}
              />
            </Col>
          </Row>
        </Grid>
      </ImageBackground>
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
