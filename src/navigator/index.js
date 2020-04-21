import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

//ComponentImport

import LandingPageScreen from "../screens/LandingPage.js";
import LoginScreen from "../screens/LoginScreen";

const Stack = createStackNavigator();

export default function NavigationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListenerLogin">
        {/* ScreenNames */}
        <Stack.Screen
          name="WelcomeScreen"
          component={LandingPageScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="ListenerLogin"
          component={LoginScreen}
          options={{ title: "Login as Listener" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
