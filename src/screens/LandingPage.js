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

      <Button
        style={styles.button}
        iconLeft
        full
        primary
        onPress={() => navigation.navigate("ListenerLogin")}
      >
        <Icon style={styles.buttonIcon} type="FontAwesome" name="sign-in" />
        <Text style={styles.buttonText}>{en.landingPage.logIn}</Text>
      </Button>
      <Button
        style={styles.button}
        iconLeft
        full
        primary
        onPress={() => navigation.navigate("ListenerRegister")}
      >
        <Icon style={styles.buttonIcon} type="FontAwesome" name="music" />
        <Text style={styles.buttonText}>{en.landingPage.register}</Text>
      </Button>
      <Button
        style={styles.button}
        iconLeft
        full
        primary
        onPress={() => navigation.navigate("PairSession")}
      >
        <Icon style={styles.buttonIcon} type="FontAwesome" name="heartbeat" />
        <Text style={styles.buttonText}>{en.landingPage.connect}</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    backgroundColor: "#4d004d",
  },
  titleText: {
    marginTop: 3,
    marginBottom: 5,
    fontFamily: "Schoolbell-Regular",
    color: "#fff",
    fontSize: 42,
  },
  hero: {
    resizeMode: "cover",
    marginTop: 3,
    width: 430,
    height: 430,
  },
  buttonIcon: {
    marginRight: 8,
  }
});
