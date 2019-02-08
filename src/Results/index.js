import { connect } from "react-redux";
import { setLibrary } from "../redux/actions/set_library";
import { setPatient } from "../redux/actions/set_patient";
import { setSmart } from "../redux/actions/set_smart";

import Results from "./Results";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const ResultsContainer = connect(
    mapStateToProps,
    { setLibrary, setPatient, setSmart }
)(Results);

export default ResultsContainer;
