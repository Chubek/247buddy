import { Provider } from "react-redux";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import "react-native-gesture-handler";
import { store, persistor } from "./src/redux/store";
import StackNavigator from "./src/navigator";
import LandingPageScreen from "./src/components/LandingPage.js";
const Stack = createStackNavigator();
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StackNavigator />
      </PersistGate>
    </Provider>
  );
}
