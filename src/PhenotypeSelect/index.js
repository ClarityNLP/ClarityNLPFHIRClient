import { connect } from "react-redux";
import { setResults } from "../redux/actions/set_results";
import { setSelections } from "../redux/actions/update_selections";

import PhenotypeSelect from "./PhenotypeSelect";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const PhenotypeSelectContainer = connect(
    mapStateToProps,
    { setResults, setSelections }
)(PhenotypeSelect);

export default PhenotypeSelectContainer;
