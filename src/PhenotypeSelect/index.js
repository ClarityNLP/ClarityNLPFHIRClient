import { connect } from "react-redux";
import { setResults } from "../redux/actions/set_results";

import PhenotypeSelect from "./PhenotypeSelect";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const PhenotypeSelectContainer = connect(
    mapStateToProps,
    { setResults }
)(PhenotypeSelect);

export default PhenotypeSelectContainer;
