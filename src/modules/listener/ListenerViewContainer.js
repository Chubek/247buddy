import { compose } from "recompose";
import { connect } from "react-redux";

import ListenerView from "./ListenerView";
import { thunkFunc } from "./ListenerState";

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
)(ListenerView);
