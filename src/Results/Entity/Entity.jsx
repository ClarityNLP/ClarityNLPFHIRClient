import React, { Component } from "react";
import Moment from "react-moment";
import { Col } from "reactstrap";
import "./main.css";

const initialState = {
    toggle: true,
    highlight_text: "",
    highlight_report_text: ""
};

export default class Entity extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentDidMount() {
        this.setHighlightText();
    }

    toggle = e => {
        this.setState({
            toggle: !this.state.toggle
        });
    };

    setHighlightText = () => {
        const { start, end, sentence } = this.props.result;

        if (start === 0 && end === 0) {
            this.setState({
                highlight_text: sentence
            });
            return;
        }

        const keyword = sentence.substr(start, end - start);
        const first = sentence.substr(0, start);
        const last = sentence.substr(
            end,
            sentence.length - first.length - keyword.length
        );

        this.setState(
            {
                highlight_text: (
                    <React.Fragment>
                        {first}
                        <span className="highlight">{keyword}</span>
                        {last}
                    </React.Fragment>
                )
            },
            this.setHighlightReportText
        );
    };

    setHighlightReportText = () => {
        const { report_text, sentence, start, end } = this.props.result;
        const keyword = sentence.substr(start, end - start);
        const tmp_highlight_report_text = [];
        const arr = report_text.split(keyword);

        for (let i = 0; i < arr.length - 1; i++) {
            let s = arr[i];

            tmp_highlight_report_text.push(s);
            tmp_highlight_report_text.push(
                <span className="highlight">{keyword}</span>
            );
        }

        this.setState({
            highlight_report_text: (
                <React.Fragment>{tmp_highlight_report_text}</React.Fragment>
            )
        });
    };

    render() {
        const { report_date } = this.props.result;
        const { toggle, highlight_text, highlight_report_text } = this.state;

        return (
            <React.Fragment>
                <Col xs="12">
                    <div className="EntityFrame" onClick={this.toggle}>
                        <Moment format="MMM D, YYYY h:mm a">
                            {report_date}
                        </Moment>
                        <div className="EntitySentence">
                            {toggle ? (
                                <p>{highlight_text}</p>
                            ) : (
                                <pre>{highlight_report_text}</pre>
                            )}
                        </div>
                    </div>
                </Col>
            </React.Fragment>
        );
    }
}
