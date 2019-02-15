import { Base64 } from "js-base64";
import axios from "axios";

import {
    SETTING_RESULTS,
    SET_RESULTS_SUCCESS,
    SET_RESULTS_FAIL
} from "./types";

const standard_columns = ["nlpql_feature", "section", "sentence", "value", "$"];

const compareColumn = (a, b, key) => {
    if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
        let a_val = a[key].toString().toLowerCase();
        let b_val = b[key].toString().toLowerCase();
        if (a_val < b_val) {
            return -1;
        }
        if (a_val > b_val) {
            return 1;
        }
    }

    return 0;
};

const generatePromises = (selections, docs) => {
    let promises = [];

    for (let i = 0; i < selections.length; i++) {
        const selection = selections[i];

        console.log("MAKING CALL WITH: ");
        console.log(selection);

        let normalized_task = selection.category;

        if (normalized_task.length > 0) {
            normalized_task += "/";
        }
        normalized_task += selection.task;
        normalized_task = normalized_task.split("/").join("~");

        const url = process.env.REACT_APP_CLARITY_NLPAAS_URL + normalized_task;

        promises.push(
            axios
                .post(url, {
                    reports: docs
                })
                .then(response => {
                    let results = response.data;
                    let matches = results
                        .filter(r => {
                            return (
                                r.hasOwnProperty("nlpql_feature") &&
                                r.nlpql_feature &&
                                r.nlpql_feature !== "null"
                            );
                        })
                        .sort((a, b) => {
                            let sort_val = 0;
                            for (let c in standard_columns) {
                                if (sort_val !== 0) {
                                    break;
                                }
                                sort_val = compareColumn(
                                    a,
                                    b,
                                    standard_columns[c]
                                );
                            }
                            return sort_val;
                        });

                    return matches;
                })
        );
    }

    return promises;
};

export const setResults = (selections, patient) => dispatch => {
    if (selections.length <= 0) {
        dispatch({
            type: SET_RESULTS_SUCCESS,
            data: []
        });
        return;
    }

    dispatch({
        type: SETTING_RESULTS
    });

    let docs = patient.documents.map(data => {
        if (data.content && data.content.length > 0) {
            let txt = "";

            for (let i in data.content) {
                if (data.content.hasOwnProperty(i)) {
                    if (data.content[i].hasOwnProperty("attachment")) {
                        let att = data.content[i]["attachment"];
                        txt = txt + Base64.decode(att["data"]) + "\n";
                    }
                }
            }

            return txt;
        }
        return "";
    });

    Promise.all(generatePromises(selections, docs))
        .then(results => {
            dispatch({
                type: SET_RESULTS_SUCCESS,
                data: results
            });
        })
        .catch(err => {
            dispatch({
                type: SET_RESULTS_FAIL,
                data: err.message
            });
        });
};