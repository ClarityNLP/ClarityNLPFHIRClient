import React, { Component } from "react";
import Moment from "react-moment";
import { Col, Modal, ModalBody } from "reactstrap";

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
        const { toggle } = this.state;
        const {
            sentence,
            start,
            end,
            term,
            report_date,
            report_text
        } = this.props.result;

        let startText = sentence.substr(0, start);
        let endText = sentence.substr(
            end,
            sentence.length - startText.length - term.length
        );

        return (
            <React.Fragment>
                <Col xs="12" className="EntityFrame" onClick={this.toggle}>
                    <Moment format="MMM D, YYYY h:mm a">{report_date}</Moment>
                    <div className="EntitySentence">
                        <p>
                            {startText}
                            <span className="highlight">{term}</span>
                            {endText}
                        </p>
                    </div>
                </Col>
                <Modal isOpen={toggle} toggle={this.toggle}>
                    <ModalBody>{report_text}</ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}
