import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import Loader from './Loader';
import PhenotypeSelect from './PhenotypeSelect';
import Results from './Results';

export default class App extends Component {
  componentDidMount() {
    if (window.FHIR) {
      window.FHIR.oauth2.authorize({
        client_id: 'my_web_app',
        scope: 'patient/*.read'
      });
    }

    this.props.setSmart().then(smart => {
      this.props.setPatient(smart);
    });
    this.props.setLibrary().catch(err => {
      console.log(err);
    });
  }

  render() {
    const { loading_library, loading_patient, loading_smart } = this.props.app;

    const loading = loading_library || loading_patient || loading_smart;

    return loading ? (
      <Loader />
    ) : (
      <React.Fragment>
        <Router>
          <Switch>
            <Route path='/results' component={Results} />
            <Route path='/' component={PhenotypeSelect} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}
