/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */

import axios from "axios";
import * as CONSTANTS from "./ListenerConstants";
import * as helpers from "../../helpers";
import * as globalStr from "../../../global";
import { Form } from "native-base";

//initialState
const initialState = {
  userName: null,
  approved: null,
  dateRegistered: null,
  email: null,
  cellNumber: null,
  avatar: null,
  categories: null,
  banned: null,
  status: {
    engagedSession: null,
    online: null,
  },
};

//thunk functions

export function getListener(listenerId) {
  if (!listenerId) {
    helpers.showErrorMessage("You haven't entered an ID.");
    return false;
  }

  return new Promise((resolve, reject) => {
    axios
      .get(`${globalStr.serverUrl}/listener/get/single/${listenerId}`)
      .then((res) => {
        const { noListenerDoc, listenerDoc } = res.data;
        if (noListenerDoc) {
          reject({ message: "No listener with this id: " + listenerId });
          return false;
        }
        resolve({ message: "Listener found.", result: listenerDoc });
        helpers.showSuccessMessage("Listener found!");
      })
      .catch((e) => {
        reject(e);
        helpers.showErrorMessage(e);
      });
  });
}

export function registerListener(registerInfo) {
  const { userName, email, number, categories } = registerInfo;
  if (!userName || !email || !number || !categories) {
    helpers.showErrorMessage("Some data hasn't been entered.");
    return false;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${globalStr.serverUrl}/listener/register`, registerInfo)
      .then((res) => {
        const { notSent, isSame, listenerDoc } = res.data;

        if (notSent) {
          helpers.showErrorMessage(
            `You haven't entered the ${notSent} field. Please resend the form and enter it.`
          );
          reject(
            `You haven't entered the ${notSent} field. Please resend the form and enter it.`
          );
          return false;
        }

        if (isSame) {
          helpers.showErrorMessage(
            `${isSame} already exists. Please enter a different one.`
          );
          reject(`${isSame} already exists. Please enter a different one.`);
          return false;
        }

        resolve({
          registered: true,
          message: "Registered Successfully.",
          listenerDoc,
        });
        helpers.showSuccessMessage("Registered Sucessfully.");
      })
      .catch((e) => {
        reject(e);
        helpers.showErrorMessage(e);
      });
  });
}

export function verifyEmail(activationCode) {
  if (!activationCode) {
    helpers.showErrorMessage("You haven't entered an activation code.");
    return false;
  }

  return new Promise((resolve, reject) => {
    axios
      .put(`${globalStr.serverUrl}/listener/verify/email`, activationCode, {
        headers: { "x-auth-listener": helpers.getListenerToken() },
      })
      .then((res) => {
        const { emailVerified } = res.data;
        resolve(emailVerified);
      })
      .catch((e) => {
        reject(e);
        helpers.showErrorMessage(e);
      });
  });
}

export function authListener(authInfo) {
  const { email, userName, number, password } = authInfo;
  if (!userName || !email || !number || !password) {
    helpers.showErrorMessage("Some data hasn't been entered.");
    return false;
  }

  return new Promise((resolve, reject) => {
    return (dispatch) => {
      axios
        .post(`${globalStr.serverUrl}/listener/auth`, authInfo)
        .then((res) => {
          const { notSent, isUser, token, listenerDoc } = res.data;

          if (notSent) {
            helpers.showErrorMessage(
              `You haven't entered the ${notSent} field. Please resend the form and enter it.`
            );
            reject(
              `You haven't entered the ${notSent} field. Please resend the form and enter it.`
            );
            return false;
          }

          if (!isUser && isUser != null) {
            helpers.showErrorMessage(`Listener doesn't exist.`);
            reject(`Listener doesn't exist.`);
            return false;
          }

          const tokenAsync = helpers.setAsync("listenerToken", token);

          if (tokenAsync) {
            resolve({
              auth: true,
              message: "Logged in Successfully.",
              listenerDoc,
              token,
            });
            helpers.showSuccessMessage("Registered Sucessfully.");
            dispatch({
              type: CONSTANTS.SET_LISTENER_DATA,
              payload: listenerDoc,
            });
          }
        })
        .catch((e) => {
          reject(e);
          helpers.showErrorMessage(e);
        });
    };
  });
}



export function setAvatar(imgFile) {
  if (!imgFile) {
    helpers.showErrorMessage("You haven't submitted an image.");
    return false;
  }

  let avatarData = new FormData();
  avatarData.append("avatar", imgFile);

  return new Promise((resolve, reject) => {
    return (dispatch) => {
      axios
        .put(`${globalStr.serverUrl}/listener/set/avatar`, avatarData, {
          headers: {
            "x-auth-listener": helpers.getListenerToken(),
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const { avatarPath } = res.data;
          resolve(avatarPath);
          dispatch({ type: CONSTANTS.SET_AVATAR, payload: avatarPath });
        })
        .catch((e) => {
          reject(e);
          helpers.showErrorMessage(e);
        });
    };
  });
}

export function changeEmail(newEmail) {
  if (!newEmail) {
    helpers.showErrorMessage("You haven't submitted an email.");
    return false;
  }

  return new Promise((resolve, reject) => {
    axios
      .put(
        `${globalStr.serverUrl}/listener/change/email`,
        { newEmail: newEmail },
        {
          headers: { "x-auth-listener": helpers.getListenerToken() },
        }
      )
      .then((res) => {
        const { verificationEmailSent } = res.data;
        resolve(verificationEmailSent);
        dispatch({ type: CONSTANTS.SET_AVATAR, payload: avatarPath });
      })
      .catch((e) => {
        reject(e);
        helpers.showErrorMessage(e);
      });
  });
}

export function setCategories(newCategories) {
  if (!newCategories) {
    helpers.showErrorMessage("You haven't submitted any categories.");
    return false;
  }

  return new Promise((resolve, reject) => {
    return (dispatch) => {
      axios
        .put(`${globalStr.serverUrl}/listener/set/categories`, newCategories, {
          headers: { "x-auth-listener": helpers.getListenerToken() },
        })
        .then((res) => {
          const { categoriesSet } = res.data;
          resolve(categoriesSet);
          if (categoriesSet) {
            dispatch({
              type: CONSTANTS.SET_CATEGORIES,
              payload: newCategories,
            });
          }
        })
        .catch((e) => {
          reject(e);
          helpers.showErrorMessage(e);
        });
    };
  });
}

export default function ListenerStateReducer(
  state = initialState,
  action = {}
) {
  switch (action.type) {
    case CONSTANTS.SET_LISTENER_DATA:
      return {
        ...state,
        userName: action.payload.userName,
        approved: action.payload.approvalStatus.approved,
        dateRegistered: action.payload.creationDate,
        email: action.payload.email,
        avatar: action.payload.avatar.src,
        cellNumber: action.payload.cell.number,
        categories: action.payload.categories,
        banned:
          action.payload.bannedStatus.expireDate <
          new Date().toISOString.substr(0, 10)
            ? false
            : true,
        "status.engagedSession": action.payload.status.currentEngagedSessionId,
        "status.online": action.payload.status.online,
      };
    case CONSTANTS.SET_STATUS:
      return {
        ...state,
        "status.online": action.payload,
      };
    case CONSTANTS.SET_AVATAR:
      return {
        ...state,
        avatar: action.payload,
      };
    case CONSTANTS.SET_CATEGORIES:
      return {
        ...state,
        categories: [...action.payload],
      };

    default:
      return state;
  }
}
