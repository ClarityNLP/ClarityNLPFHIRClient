import { connect } from "react-redux";

import Header from "./Header";

function mapStateToProps(state) {
    return {
        app: state.app
    };
}

const HeaderContainer = connect(
    mapStateToProps,
    {}
)(Header);

export default HeaderContainer;
