import React, { Component } from "react";
import ReactJson from "react-json-view";

import Loader from "../Loader";

export default class Results extends Component {
    componentDidMount() {}

    render() {
        const { loading_results, results } = this.props.app;

        return loading_results ? (
            <Loader />
        ) : (
            <React.Fragment>
                {results.map(result => {
                    return (
                        <ReactJson
                            src={result}
                            displayObjectSize={false}
                            displayDataTypes={false}
                        />
                    );
                })}
            </React.Fragment>
        );
    }
}
