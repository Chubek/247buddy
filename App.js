import { Provider } from "react-redux";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { store, persistor } from "./src/redux/store";
import StackNavigator from "./src/navigator";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        }
        persistor={persistor}
      >
        <AppView />
      </PersistGate>
    </Provider>
  );
}

