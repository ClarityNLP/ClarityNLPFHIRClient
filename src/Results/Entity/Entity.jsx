import React, { Component } from "react";
import Moment from "react-moment";
import { Col, Modal, ModalBody } from "reactstrap";

import axios from "axios";

export default class Entity extends Component {
    constructor(props) {
        super(props);
        const { report_id } = this.props.result;

        let url =
            process.env.REACT_APP_CLARITY_NLP_URL + "document/" + report_id;

        axios.get(url).then(response => {
            this.fullText = response.data.report_text;
        });

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
        const { toggle, fullText } = this.state;
        const { sentence, start, end, text, report_date } = this.props.result;

        let startText = sentence.substr(0, start);
        let endText = sentence.substr(
            end,
            sentence.length - startText.length - text.length
        );

        return (
            <React.Fragment>
                <Col xs="12" className="EntityFrame" onClick={this.toggle}>
                    <Moment format="MMM D, YYYY h:mm a">{report_date}</Moment>
                    <div className="EntitySentence">
                        <p>
                            {startText}
                            <span className="highlight">{text}</span>
                            {endText}
                        </p>
                    </div>
                </Col>
                <Modal isOpen={toggle} toggle={this.toggle}>
                    <ModalBody>{this.fullText}</ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}
