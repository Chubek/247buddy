import { compose } from "recompose";
import { connect } from "react-redux";

import AuthView from "./AuthView";
import { thunkFunc } from "./AuthState";

export default compose(
  connect(
    (state) => ({
      stateOne: state.stateOne,
      stateTwo: state.stateTwo,
      stateThree: state.stateThree,
    }),
    (dispatch) => ({
      thunkFunc: (arg) => dispatch(thunkFunc(arg)),
    })
  )
)(AuthView);
