import React, { Component } from "react";
import { Container, Row } from "reactstrap";
import { Provider } from "react-redux";

import "./App.css";

import PhenotypeSelect from "./PhenotypeSelect";

export default class App extends Component {
    render() {
        const { store } = this.props;

        return (
            <Provider store={store}>
                <Container>
                    <Row className="justify-content-center align-items-center">
                        <PhenotypeSelect />
                    </Row>
                </Container>
            </Provider>
        );
    }
}
