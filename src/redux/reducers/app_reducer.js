import * as types from "../actions/types";

const initialState = {
    loading_library: false,
    library: {},
    library_error: "",
    loading_patient: false,
    patient: {},
    patient_error: "",
    loading_smart: false,
    smart: {},
    smart_error: "",
    selections: [],
    loading_results: false,
    results: [],
    results_error: ""
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SETTING_LIBRARY:
            return {
                ...state,
                loading_library: true
            };
        case types.SET_LIBRARY_SUCCESS:
            return {
                ...state,
                loading_library: false,
                library: action.data
            };
        case types.SET_LIBRARY_FAIL:
            return {
                ...state,
                loading_library: false,
                library_error: action.data
            };
        case types.SETTING_PATIENT:
            return {
                ...state,
                loading_patient: true
            };
        case types.SET_PATIENT_SUCCESS:
            return {
                ...state,
                loading_patient: false,
                patient: action.data
            };
        case types.SET_PATIENT_FAIL:
            return {
                ...state,
                loading_patient: false,
                patient_error: action.data
            };
        case types.SETTING_SMART:
            return {
                ...state,
                loading_smart: true
            };
        case types.SET_SMART_SUCCESS:
            return {
                ...state,
                loading_smart: false,
                smart: action.data
            };
        case types.SET_SMART_FAIL:
            return {
                ...state,
                loading_smart: false,
                smart_error: action.data
            };
        case types.REMOVE_SELECTION:
            return {
                ...state,
                selections: state.selections.filter(value => {
                    return value.task !== action.data.task;
                })
            };
        case types.ADD_SELECTION:
            return {
                ...state,
                selections: [...state.selections, action.data]
            };
        case types.SET_SELECTIONS:
            return {
                ...state,
                selections: action.data
            };
        case types.SETTING_RESULTS:
            return {
                ...state,
                loading_results: true
            };
        case types.SET_RESULTS_SUCCESS:
            return {
                ...state,
                loading_results: false,
                results_error: "",
                results: action.data
            };
        case types.SET_RESULTS_FAIL:
            return {
                ...state,
                loading_results: false,
                results_error: action.data
            };
        default:
            return state;
    }
};

export { reducer };
