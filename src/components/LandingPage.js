/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Container, Button, Icon } from "native-base";
import * as en from "../localization/en.json";

export default function LandingPageScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}> {en.appName} </Text>
      <Image
        style={styles.hero}
        source={require("../../assets/img/hero.png")}
      />
      <Container style={styles.buttonContainer}>
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
          <Icon type="FontAwesome" name="music" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    backgroundColor: "#4d004d",
  },
  titleText: {
    flex: 1,
    marginTop: 3,
    fontFamily:
      Platform.OS === "ios" ? "Schoolbell-Regular" : "Schoolbell-Regular.ttf",
    fontSize: 42,
  },
  hero: {
    flex: 2,
    margin: 4,
    width: 200,
    height: 200,
  },
  buttonContainer: {
    flex: 3,
    marginTop: 5,
    marginBottom: 3,
    marginRight: 2,
    marginLeft: 2,
  },
});
