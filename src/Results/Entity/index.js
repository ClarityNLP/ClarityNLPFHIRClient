import { connect } from "react-redux";

import Entity from "./Entity";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const EntityContainer = connect(
    mapStateToProps,
    {}
)(Entity);

export default EntityContainer;
