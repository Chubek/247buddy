import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

//ComponentImport

import LandingPageScreen from "../screens/LandingPage.js";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

export default function NavigationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RegisterScreen">
        {/* ScreenNames */}
        <Stack.Screen
          name="WelcomeScreen"
          component={LandingPageScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Login as Listener" }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Register Listener" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
