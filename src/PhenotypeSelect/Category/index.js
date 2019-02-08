import { connect } from "react-redux";

import Category from "./Category";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const CategoryContainer = connect(
    mapStateToProps,
    {}
)(Category);

export default CategoryContainer;
