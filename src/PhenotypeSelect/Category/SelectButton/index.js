import { connect } from "react-redux";
import {
    removeSelection,
    addSelection
} from "../../../redux/actions/update_selections";

import SelectButton from "./SelectButton";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const SelectButtonContainer = connect(
    mapStateToProps,
    { removeSelection, addSelection }
)(SelectButton);

export default SelectButtonContainer;
