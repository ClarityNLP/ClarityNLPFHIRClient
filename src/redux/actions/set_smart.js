import { SET_SMART_SUCCESS } from '../actions/types';

export const setSmart = () => dispatch => {
  return new Promise((resolve, reject) => {
    let tmp_smart = null;

    // if (process.env.NODE_ENV === 'development') {
    //   tmp_smart = window.FHIR.client({
    //     serviceUrl: process.env.REACT_APP_DEFAULT_FHIR_URL,
    //     patientId: '14628'
    //   });
    // } else {
    if (window.FHIR) {
      window.FHIR.oauth2.ready(smart => {
        tmp_smart = smart;
      });
    }
    // }

    dispatch({
      type: SET_SMART_SUCCESS,
      data: tmp_smart
    });
    resolve(tmp_smart);
  });
};
