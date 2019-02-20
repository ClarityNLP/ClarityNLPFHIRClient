import React, { Component } from "react";
import Moment from "react-moment";
import { Col } from "reactstrap";
import "./main.css";

const initialState = {
    toggle: true,
    highlight_text: ""
};

export default class Entity extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentDidMount() {
        this.setHighlightText();
    }

    toggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    };

    setHighlightText = () => {
        const { start, end, sentence } = this.props.result;

        if (start === 0 && end === 0) {
            return sentence;
        }

        let keyword = sentence.substr(start, end - start);
        let first = sentence.substr(0, start);
        let last = sentence.substr(
            end,
            sentence.length - first.length - keyword.length
        );

        this.setState({
            highlight_text: (
                <p>
                    {first}
                    <span className="highlight">{keyword}</span>
                    {last}
                </p>
            )
        });
    };

    render() {
        const { report_text, report_date } = this.props.result;
        const { toggle, highlight_text } = this.state;

        return (
            <React.Fragment>
                <Col xs="12">
                    <div className="EntityFrame" onClick={this.toggle}>
                        <Moment format="MMM D, YYYY h:mm a">
                            {report_date}
                        </Moment>
                        <div className="EntitySentence">
                            {toggle ? highlight_text : <pre>{report_text}</pre>}
                        </div>
                    </div>
                </Col>
            </React.Fragment>
        );
    }
}
