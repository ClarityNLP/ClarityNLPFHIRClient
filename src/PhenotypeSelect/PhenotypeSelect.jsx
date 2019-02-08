import React, { Component } from "react";
import { Container, Row, Col, Badge, Button } from "reactstrap";
import prettify from "../utils/prettify";

import "./main.css";

import Category from "./Category";

const inititalState = {};

export default class PhenotypeSelect extends Component {
    constructor(props) {
        super(props);

        this.state = inititalState;
    }

    renderOptions = () => {
        const { selections } = this.props.app;

        if (selections.length > 0) {
            return selections.map(value => {
                return (
                    <Badge key={value} color="primary" pill size="lg">
                        {prettify(value.task, true)}
                    </Badge>
                );
            });
        } else {
            return <div className="selected-option">No options selected.</div>;
        }
    };

    renderLibrary = () => {
        const { library } = this.props.app;
        let library_display = [];

        for (let category in library) {
            library_display.push(
                <Category
                    key={category}
                    category={category}
                    values={library[category]}
                />
            );
        }

        return library_display;
    };

    handleRunClick = () => {
        const { selections, patient } = this.props.app;

        if (selections.length > 0 && patient !== {} && patient.documents) {
            this.props.setResults(selections, patient);
            this.props.history.push("/results");
        }
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col xs="8">
                        <Row>{this.renderLibrary()}</Row>
                    </Col>
                    <Col xs="4" className="selected-options-container">
                        {this.renderOptions()}
                        <Button
                            outline
                            color="primary"
                            size="lg"
                            block
                            onClick={this.handleRunClick}
                        >
                            Run
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}
