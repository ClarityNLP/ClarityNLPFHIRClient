import React, { Component } from "react";
import { Row, Col } from "reactstrap";

import "./main.css";

export default class Header extends Component {
    render() {
        const { name, id } = this.props.app.patient;

        return (
            <header>
                <Row>
                    <Col>
                        <h3 className="title">
                            {name} ({id})
                        </h3>
                    </Col>
                </Row>
            </header>
        );
    }
}
