import * as types from "../actions/types";

const initialState = {
    loadingLibrary: false,
    library: null,
    library_error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SETTING_LIBRARY:
            return {
                ...state,
                loadingLibrary: true
            };
        case types.SET_LIBRARY_SUCCESS:
            return {
                ...state,
                loadingLibrary: false,
                library: action.data
            };
        case types.SET_LIBRARY_FAIL:
            return {
                ...state,
                loadingLibrary: false,
                library_error: action.data
            };
        default:
            return state;
    }
};

export { reducer };
