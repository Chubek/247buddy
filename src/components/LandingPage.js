/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */

import { StyleSheet, Image, Text } from "react-native";
import PropTypes from "prop-types";
import { Container, Button, Icon } from "native-base";
import * as en from "../localization/en.json";
import { useNavigation } from "@react-navigation/native";

export default function LandingPageComponent(props) {
  const navigation = useNavigation();
  return (
    <Container style={styles.container}>
      <Text style={styles.titleText}>{en.appName}</Text>
      <Image
        style={styles.hero}
        source={require("../../assets/img/hero.png")}
      />
      <Button
        style={styles.loginButton}
        iconLeft
        light
        onPress={() => navigation.navigate("ListenerLogin")}
      >
        <Icon type="FontAwesome" name="sign-in" />
        <Text>{en.landingPage.logIn}</Text>
      </Button>
      <Button
        style={styles.registerButton}
        iconLeft
        light
        onPress={() => navigation.navigate("ListenerRegister")}
      >
        <Icon type="FontAwesome" name="sign-up" />
        <Text>{en.landingPage.register}</Text>
      </Button>
      <Button
        style={styles.pairButton}
        iconLeft
        light
        onPress={() => navigation.navigate("PairSession")}
      >
        <Icon type="FontAwesome" name="heartbeat" />
        <Text>{en.landingPage.connect}</Text>
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "spaced-around",
    paddingHorizontal: 30,
    backgroundColor: randomHexColor(),
  },
  titleText: {
    marginTop: 3,
  },
});

LandingPageComponent.propTypes = {
  appTitle: PropTypes.element.isRequired,
};
