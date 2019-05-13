import { SET_SMART_SUCCESS } from '../actions/types';

export const setSmart = () => dispatch => {
  return new Promise((resolve, reject) => {
    // DEV SMART SETUP

    // const tmp_smart = window.FHIR.client({
    //   serviceUrl: process.env.REACT_APP_DEFAULT_FHIR_URL,
    //   patientId: '14628'
    // });

    // dispatch({
    //   type: SET_SMART_SUCCESS,
    //   data: tmp_smart
    // });

    // resolve(tmp_smart);

    // PROD FHIR SETUP

    if (window.FHIR) {
      window.FHIR.oauth2.ready(smart => {
        dispatch({
          type: SET_SMART_SUCCESS,
          data: smart
        });

        resolve(smart);
      });
    }
  });
};
