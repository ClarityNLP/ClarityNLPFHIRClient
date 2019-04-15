import { connect } from "react-redux";
import { setLibrary } from "./redux/actions/set_library";
import { setPatient } from "./redux/actions/set_patient";
import { setSmart } from "./redux/actions/set_smart";

import App from "./App";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const AppContainer = connect(
    mapStateToProps,
    { setLibrary, setPatient, setSmart }
)(App);

export default AppContainer;
