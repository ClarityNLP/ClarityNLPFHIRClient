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
            current_results: [],
            isPrevDisabled: true,
            isNextDisabled: false,
            page: 0
        };
    }

    getCurrentResults = page => {
        const { results, results_error } = this.props.app;

        if (results_error !== "" || results.length <= 0) {
            return [];
        }

        this.setState({
            current_results: results[page].map(result => {
                return <Entity result={result} />;
            })
        });
    };

    componentDidMount() {
        const { loading_results, results } = this.props.app;

        if (!loading_results && !(results.length > 0)) {
            this.props.history.push("/");
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.app.results !== prevProps.app.results) {
            this.getCurrentResults(0);
        }
    }

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

    render() {
        const { loading_results, selections } = this.props.app;
        const {
            current_results,
            isPrevDisabled,
            isNextDisabled,
            page
        } = this.state;

        return loading_results ? (
            <Loader />
        ) : (
            <React.Fragment>
                <Container>
                    <Row className="justify-content-center mb-2">
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
                            <h2>{prettify(selections[page].task, true)}</h2>
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

                    <Row>
                        {current_results.length > 0 ? (
                            current_results
                        ) : (
                            <Col xs="12">
                                <p>No Results Found.</p>
                            </Col>
                        )}
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
