import axios from "axios";
import {
    SETTING_LIBRARY,
    SET_LIBRARY_SUCCESS,
    SET_LIBRARY_FAIL
} from "./types";

export const getLibrary = () => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: SETTING_LIBRARY,
            data: {}
        });
        axios
            .get(process.env.REACT_APP_CLARITY_NLPAAS_URL + "list/all")
            .then(response => {
                const { data } = response;
                let tmp_library = {};

                for (let value of data) {
                    let split_value = value.split("/");
                    let category = split_value[0];
                    let name = split_value[1];

                    if (!tmp_library[category]) {
                        tmp_library = {
                            ...tmp_library,
                            [category]: [name]
                        };
                    } else {
                        tmp_library[category] = [
                            ...tmp_library[category],
                            name
                        ];
                    }
                }

                dispatch({
                    type: SET_LIBRARY_SUCCESS,
                    data: tmp_library
                });
                resolve();
            })
            .catch(err => {
                dispatch({
                    type: SET_LIBRARY_FAIL,
                    data: err
                });
                reject();
            });
    });
};
