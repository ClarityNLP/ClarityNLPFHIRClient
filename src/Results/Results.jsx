import React, { Component } from "react";
import { Container, Row } from "reactstrap";

import "./main.css";

import Loader from "../Loader";
import Entity from "./Entity";

export default class Results extends Component {
    componentDidMount() {}

    displayResult = result => {
        return <Entity key={result} result={result} />;
    };

    render() {
        const { loading_results, results } = this.props.app;

        return loading_results ? (
            <Loader />
        ) : (
            <React.Fragment>
                <Container>
                    <Row>
                        {results.map(result => {
                            return this.displayResult(result);
                        })}
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
