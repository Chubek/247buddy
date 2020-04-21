import { combineReducers } from "redux";
//NOTE: do NOT remove these comments.

//imports

import listener from "../modules/listener/ListenerState";
import auth from "../modules/auth/AuthState";

export default combineReducers({
  //combines
listener,
  auth,
});
