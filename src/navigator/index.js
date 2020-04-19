import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

//ComponentImport

import LandingPageScreen from "../screens/LandingPage.js";
const Stack = createStackNavigator();

export default function NavigationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        {/* ScreenNames */}
        <Stack.Screen
          name="WelcomeScreen"
          component={LandingPageScreen}
          options={{ title: "Welcome" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
