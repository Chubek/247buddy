import { compose } from "recompose";
import { connect } from "react-redux";

import ListenerView from "./ListenerView";
import { authListener } from "./ListenerState";

export default compose(
  connect(
    (state) => ({
      stateOne: state.stateOne,
      stateTwo: state.stateTwo,
      stateThree: state.stateThree,
    }),
    (dispatch) => ({
      onAuthListener: (authInfo) => dispatch(authListener(authInfo)),
    })
  )
)(ListenerView);
