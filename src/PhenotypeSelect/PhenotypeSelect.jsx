import React, { Component } from "react";
import { Container, Row, Col, Button, CardColumns } from "reactstrap";

import "./main.css";

import Category from "./Category";

const inititalState = {};

export default class PhenotypeSelect extends Component {
    constructor(props) {
        super(props);

        this.state = inititalState;
    }

    componentDidMount() {
        this.props.setSelections([]);
        this.props.setResults([], null);
    }

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
        const { error_alert } = this.state;

        return (
            <Container>
                {error_alert}
                <Row>
                    <Col xs="12" className="selected-options-container">
                        <Row className="justify-content-end">
                            <Col md="3" className="align-self-end">
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
                    </Col>
                    <Col xs="12">
                        <CardColumns>{this.renderLibrary()}</CardColumns>
                    </Col>
                </Row>
            </Container>
        );
    }
}
