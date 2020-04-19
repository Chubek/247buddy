/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Container, Button, Icon } from "native-base";
import * as en from "../localization/en.json";

export default function LandingPageScreen({ navigation }) {
  return (
    <View>
      <Text>Hello </Text>
      <Image source={require("../../assets/img/hero.png")} />
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
