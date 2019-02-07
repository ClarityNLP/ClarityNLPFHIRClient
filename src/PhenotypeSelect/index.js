import { connect } from "react-redux";
import { getLibrary } from "../redux/actions/get_library";

import Main_View from "./Main_View";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const PhenotypeSelect = connect(
    mapStateToProps,
    { getLibrary }
)(Main_View);

export default PhenotypeSelect;
