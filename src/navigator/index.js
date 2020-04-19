import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//ComponentImport

import LandingPageComponent from "../components/LandingPage.js";
const Stack = createStackNavigator();

export default function NavigationStack() {
  return (
    <Stack.Navigator initialRouteName="WelcomeScreen">
      //StackScreens
      <Stack.Screen
        name="WelcomeScreen"
        component={LandingPageComponent}
        options={{ title: "Welcome" }}
      />
      ,
    </Stack.Navigator>
  );
}
