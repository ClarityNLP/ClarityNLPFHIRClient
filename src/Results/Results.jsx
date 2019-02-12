import React, { Component } from "react";
import { Container, Row } from "reactstrap";

import "./main.css";

import Loader from "../Loader";
import Entity from "./Entity";

export default class Results extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categorized_results: null
        };
    }

    componentDidMount() {
        const { loading_results, results } = this.props.app;

        if (!loading_results && !(results.length > 0)) {
            this.props.history.push("/");
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.app.results !== prevProps.app.results) {
            this.categorizeResults();
        }
    }

    categorizeResults = () => {
        const { results } = this.props.app;

        let tmp_results = {};

        for (let result of results) {
            const { nlpql_feature } = result;

            if (!tmp_results[nlpql_feature]) {
                tmp_results = {
                    ...tmp_results,
                    [nlpql_feature]: [result]
                };
            } else {
                tmp_results[nlpql_feature] = [
                    ...tmp_results[nlpql_feature],
                    result
                ];
            }
        }

        this.setState({
            categorized_results: tmp_results
        });
    };

    renderResults = () => {
        const { results_error, selections } = this.props.app;
        const { categorized_results } = this.state;

        if (results_error === "") {
            let categories = [];

            for (let feature in categorized_results) {
                if (categorized_results.hasOwnProperty(feature)) {
                    let tmp = categorized_results[feature].map(result => {
                        return (
                            <Entity key={result.report_id} result={result} />
                        );
                    });

                    categories.push(
                        <div className="EntityContainer">
                            <h5>{feature}</h5>
                            {tmp}
                        </div>
                    );
                }
            }

            return categories;
        } else {
            return (
                <div>
                    <p>No matches found.</p>
                </div>
            );
        }
    };

    render() {
        const { loading_results } = this.props.app;

        return loading_results ? (
            <Loader />
        ) : (
            <React.Fragment>
                <Container>
                    <Row>{this.renderResults()}</Row>
                </Container>
            </React.Fragment>
        );
    }
}
