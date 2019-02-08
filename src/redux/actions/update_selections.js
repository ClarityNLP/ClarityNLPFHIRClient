import { REMOVE_SELECTION, ADD_SELECTION } from "./types";

export const removeSelection = selection => {
    return {
        type: REMOVE_SELECTION,
        data: selection
    };
};

export const addSelection = selection => {
    return {
        type: ADD_SELECTION,
        data: selection
    };
};
