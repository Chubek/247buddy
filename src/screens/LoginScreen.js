/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import * as React from "react";
import LoginPage from "../components/stateful/LoginPage";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import ListenerView from "../modules/listener/ListenerView";

function LoginScreen() {
  const navigation = useNavigation();

  return <ListenerView navigation={navigation} switcher="login" />;
}

export default connect(null, mapDispatchToProps)(LoginScreen);
