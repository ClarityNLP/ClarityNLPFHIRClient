import * as types from "../actions/types";

const initialState = {
    library: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_LIBRARY:
            return {
                ...state,
                library: action.data
            };
        default:
            return state;
    }
};

export { reducer };
