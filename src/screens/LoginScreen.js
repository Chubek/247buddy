/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */
import * as React from "react";
import LoginPage from "../components/stateful/LoginPage";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { authListener } from "../modules/listener/ListenerState";

function LoginScreen() {
  const navigation = useNavigation();

  return <LoginPage navigation={navigation} />;
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuthListener: (authInfo) => {
      dispatch(authListener(authInfo));
    },
  };
};

export default connect(null, mapDispatchToProps)(LoginScreen);
