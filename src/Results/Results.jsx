import React, { Component } from "react";
import { Container, Row } from "reactstrap";

import "./main.css";

import Loader from "../Loader";
import Entity from "./Entity";

export default class Results extends Component {
    componentDidMount() {}

    renderResults = () => {
        const { results, results_error } = this.props.app;

        console.log(results);

        if (results_error === "" && results.length > 0) {
            return results.map(result => {
                return <Entity result={result} />;
            });
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
