import React, { Component } from "react";
import prettify from "../../utils/prettify";

const inititalState = {
    sections: []
};

export default class Library extends Component {
    constructor(props) {
        super(props);

        this.state = inititalState;
    }
    componentDidUpdate(prevProps) {
        if (this.props.library !== prevProps.library) {
            const { loading, library } = this.props;

            if (!loading) {
                let tmp_sections = [];

                for (let category in library) {
                    tmp_sections.push(
                        <section className="col" key={category}>
                            <h1>{prettify(category, true)}</h1>
                            {library[category].map(value => {
                                return (
                                    <p key={value}>{prettify(value, true)}</p>
                                );
                            })}
                        </section>
                    );
                }

                this.setState({
                    sections: tmp_sections
                });
            } else {
                this.setState({
                    sections: <h1>LOADing...</h1>
                });
            }
        }
    }

    render() {
        return <React.Fragment>{this.state.sections}</React.Fragment>;
    }
}
