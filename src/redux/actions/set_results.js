import axios from 'axios';

import {
  SETTING_RESULTS,
  SET_RESULTS_SUCCESS,
  SET_RESULTS_FAIL,
  RESET_RESULTS
} from './types';

const standard_columns = ['nlpql_feature', 'section', 'sentence', 'value', '$'];

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

const generatePromises = (selections, patient, fhir) => {
  let promises = [];

  const postData = {
    reports: patient.documents,
    patient_id: patient.id,
    fhir: fhir
  };

  for (let i = 0; i < selections.length; i++) {
    const selection = selections[i];
    const normalized_task = selection.category + '/' + selection.task;
    const url = process.env.REACT_APP_CLARITY_NLPAAS_URL + normalized_task;

    promises.push(
      axios.post(url, postData).then(response => {
        let results = response.data;
        let matches = results
          .filter(r => {
            return (
              r.hasOwnProperty('nlpql_feature') &&
              r.nlpql_feature &&
              r.nlpql_feature !== 'null'
            );
          })
          .sort((a, b) => {
            let sort_val = 0;
            for (let c in standard_columns) {
              if (sort_val !== 0) {
                break;
              }
              sort_val = compareColumn(a, b, standard_columns[c]);
            }
            return sort_val;
          });

        return matches;
      })
    );
  }

  return promises;
};

export const setResults = (selections, patient, fhir) => dispatch => {
  if (selections.length <= 0) {
    dispatch({
      type: RESET_RESULTS
    });
    return;
  }

  dispatch({
    type: SETTING_RESULTS
  });

  Promise.all(generatePromises(selections, patient, fhir))
    .then(results => {
      dispatch({
        type: SET_RESULTS_SUCCESS,
        data: results
      });
    })
    .catch(err => {
      dispatch({
        type: SET_RESULTS_FAIL,
        data: err.response.data.message
      });
    });
};
