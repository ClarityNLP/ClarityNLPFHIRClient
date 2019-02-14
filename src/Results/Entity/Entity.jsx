import React, { Component } from "react";
import Moment from "react-moment";
import { Col } from "reactstrap";

import "./main.css";
export default class Entity extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toggle: false
        };
    }

    toggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    };

    render() {
        const { report_date, sentence } = this.props.result;

        return (
            <React.Fragment>
                <Col xs="12">
                    <div className="EntityFrame">
                        <Moment format="MMM D, YYYY h:mm a">
                            {report_date}
                        </Moment>
                        <div className="EntitySentence">{sentence}</div>
                    </div>
                </Col>
            </React.Fragment>
        );
    }
}
