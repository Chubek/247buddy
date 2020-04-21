import AsyncStorage from "@react-native-community/async-storage";
import globalStr from "../../global";
import { showMessage, hideMessage } from "react-native-flash-message";
import SmsListener from "react-native-android-sms-listener";

export const showErrorMessage = async (errorMessage) => {
  showMessage({
    message: errorMessage,
    type: "warning",
    onPress: hideMessage(),
  });
};

export const showSuccessMessage = (successMessage) => {
  showMessage({
    message: successMessage,
    type: "success",
    onPress: hideMessage(),
  });
};

export const getListenerToken = async () => {
  try {
    const token = await AsyncStorage.getItem("listenerToken");

    if (!token) {
      showErrorMessage("No token is set!");
      return false;
    }
    return token;
  } catch (e) {
    showErrorMessage(e);
  }

  return true;
};

export const setAsync = async (name, data) => {
  try {
    const token = await AsyncStorage.setItem(name, data);

    if (!token) {
      showErrorMessage("Token set failed");
      return false;
    }
    return token;
  } catch (e) {
    showErrorMessage(e);
  }
  return true;
};

export const getEditDates = (editCaptures) => {
  let ret = [];
  ret = [];
  editCaptures.forEach((edit) => {
    ret.push(edit.editDate);
  });

  return ret;
};

export const getDate = () => {
  return new Date().toISOString().substr(0, 10);
};

export const getOtpFromSms = () => {
  SmsListener.addListener((message) => {
    const verificationCodeRegex = /([\d]{4})/;

    if (verificationCodeRegex.test(message.body)) {
      return message.body.match(verificationCodeRegex);
    }
  });
};
