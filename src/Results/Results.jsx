import React, { Component } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import prettify from "../utils/prettify";

import "./main.css";

import Loader from "../Loader";
import Entity from "./Entity";

export default class Results extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current_results: {},
            current_task: "",
            isPrevDisabled: true,
            isNextDisabled: false,
            page: 0
        };
    }

    componentDidMount() {
        const { results, loading_results } = this.props.app;

        if (!loading_results) {
            if (results.length > 0) {
                this.getCurrentResults(0);
            } else {
                this.props.history.push("/");
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { results_error } = this.props.app;

        if (this.props.app !== prevProps.app) {
            if (results_error !== "") {
                this.props.history.push("/");
            } else {
                this.getCurrentResults(0);
            }
        }
    }

    getCurrentResults = page => {
        const { results, results_error, selections } = this.props.app;
        let tmp_currentResults = {};

        if (results_error !== "" || results[page].length <= 0) {
            this.setState({
                current_results: false,
                current_task: prettify(selections[page].task, true)
            });
            return;
        }

        for (let result of results[page]) {
            if (result.nlpql_feature) {
                if (tmp_currentResults.hasOwnProperty(result.nlpql_feature)) {
                    tmp_currentResults[result.nlpql_feature] = [
                        ...tmp_currentResults[result.nlpql_feature],
                        result
                    ];
                } else {
                    tmp_currentResults = {
                        ...tmp_currentResults,
                        [result.nlpql_feature]: [result]
                    };
                }
            }
        }

        this.setState({
            current_results: tmp_currentResults,
            current_task: prettify(selections[page].task, true)
        });
    };

    goToPrevious = () => {
        const { page } = this.state;

        let disabled = false;
        let previous = page - 1;

        if (previous - 1 < 0) {
            disabled = true;
        }

        this.setState({
            isNextDisabled: false,
            isPrevDisabled: disabled,
            page: previous
        });
        this.getCurrentResults(previous);
    };

    goToNext = () => {
        const { selections } = this.props.app;
        const { page } = this.state;

        let disabled = false;
        let next = page + 1;

        if (next + 1 > selections.length - 1) {
            disabled = true;
        }

        this.setState({
            isPrevDisabled: false,
            isNextDisabled: disabled,
            page: next
        });
        this.getCurrentResults(next);
    };

    displayResults = () => {
        const { current_results } = this.state;
        let display = [];

        if (!current_results) {
            return (
                <Col>
                    <p>No Results Found.</p>
                </Col>
            );
        }

        for (let feature in current_results) {
            let featureHeader = (
                <Col xs="12" className="mb-2">
                    <h4>Feature: {feature}</h4>
                </Col>
            );
            let featureResults = [];

            const results = current_results[feature];

            for (let result of results) {
                featureResults.push(<Entity result={result} />);
            }

            display.push(
                <Row>
                    {featureHeader}
                    {featureResults}
                </Row>
            );
        }

        return display;
    };

    render() {
        const { loading_results, selections } = this.props.app;
        const { current_task, isPrevDisabled, isNextDisabled } = this.state;

        return loading_results ? (
            <Loader />
        ) : (
            <React.Fragment>
                <Container>
                    <Row className="justify-content-center mb-5">
                        {selections.length > 1 ? (
                            <Col md="2">
                                <Button
                                    block
                                    disabled={isPrevDisabled}
                                    outline
                                    color="primary"
                                    onClick={this.goToPrevious}
                                >
                                    Previous
                                </Button>
                            </Col>
                        ) : null}
                        <Col md="8" className="text-center">
                            <h1>{current_task}</h1>
                        </Col>
                        {selections.length > 1 ? (
                            <Col md="2">
                                <Button
                                    block
                                    disabled={isNextDisabled}
                                    outline
                                    color="primary"
                                    onClick={this.goToNext}
                                >
                                    Next
                                </Button>
                            </Col>
                        ) : null}
                    </Row>
                    {this.displayResults()}
                </Container>
            </React.Fragment>
        );
    }
}
