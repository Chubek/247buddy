/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import ListenerView from "../modules/listener/ListenerView";

export default function LoginScreen() {
  const navigation = useNavigation();

  return <ListenerView navigation={navigation} switcher="register" />;
}

