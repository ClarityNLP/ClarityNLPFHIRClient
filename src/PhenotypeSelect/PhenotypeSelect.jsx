import React, { Component } from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import prettify from '../utils/prettify';
import Select from 'react-select';

const initialState = {
  categoryOptions: [],
  categorySelections: [],
  phenotypeOptions: [],
  phenotypeSelections: []
};

export default class PhenotypeSelect extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    const { library } = this.props.app;
    const tmp_categoryOptions = [];

    for (let prop in library) {
      if (library.hasOwnProperty(prop)) {
        const prettyProp = prettify(prop, true);

        tmp_categoryOptions.push({
          value: prop,
          label: prettyProp
        });
      }
    }

    this.setState(
      {
        categoryOptions: tmp_categoryOptions,
        categorySelections: tmp_categoryOptions
      },
      this.setPhenotypeOptions
    );
  }

  setPhenotypeOptions = () => {
    const { library } = this.props.app;
    const { categorySelections } = this.state;
    let tmp_phenotypeOptions = [];

    for (let index in categorySelections) {
      const category = categorySelections[index].value;
      let tmp = [];

      tmp = library[category].map(value => {
        if (value) {
          const prettyValue = prettify(value, true);

          return {
            value: {
              task: value,
              category: category
            },
            label: prettyValue
          };
        }

        return {};
      });

      tmp_phenotypeOptions.push(tmp);
    }

    this.setState({
      phenotypeOptions: tmp_phenotypeOptions.flat()
    });
  };

  handleCategorySelect = value => {
    this.setState(
      {
        categorySelections: value
      },
      this.setPhenotypeOptions
    );
  };

  handlePhenotypeSelect = value => {
    this.setState({
      phenotypeSelections: value
    });
  };

  handleRunClick = () => {
    const { patient, smart } = this.props.app;
    const { phenotypeSelections } = this.state;

    const selections = phenotypeSelections.map(value => {
      return value.value;
    });

    this.props.setSelections(selections, patient);

    if (selections.length > 0 && patient !== {} && patient.documents) {
      this.props.setResults(selections, patient, smart.server);
      this.props.history.push('/results');
    }
  };

  render() {
    const { results_error } = this.props.app;
    const {
      categoryOptions,
      categorySelections,
      phenotypeOptions,
      phenotypeSelections
    } = this.state;

    return (
      <Container>
        <Row className='justify-content-center align-items-center'>
          <Col md='8'>
            <Row className='justify-content-end'>
              {results_error === '' ? null : (
                <Col xs='12' className='mb-3'>
                  <Alert color='danger'>{results_error}</Alert>
                </Col>
              )}
              <Col xs='12' className='mb-3'>
                <Select
                  isMulti={true}
                  value={categorySelections}
                  onChange={this.handleCategorySelect}
                  options={categoryOptions}
                  placeholder='Select Categories...'
                />
              </Col>
              <Col xs='12' className='mb-3'>
                <Select
                  isMulti={true}
                  value={phenotypeSelections}
                  onChange={this.handlePhenotypeSelect}
                  options={phenotypeOptions}
                  placeholder='Select Phenotypes...'
                />
              </Col>
              <Col md='4' className='mb-3'>
                <Button
                  block
                  outline
                  color='primary'
                  onClick={this.handleRunClick}
                >
                  RUN
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
