import React, { Component } from "react";
import { ListGroupItem } from "reactstrap";

import prettify from "../../../utils/prettify";

export default class SelectButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false
        };
    }

    handleClick = () => {
        const { task, category } = this.props;
        const { active } = this.state;

        let selection = {
            task: task,
            category: category
        };

        this.setState({ active: !active });
        if (!active) {
            this.props.addSelection(selection);
        } else {
            this.props.removeSelection(selection);
        }
    };

    render() {
        const { task } = this.props;
        const { active } = this.state;

        return (
            <React.Fragment>
                <ListGroupItem
                    active={active}
                    tag="button"
                    action
                    onClick={this.handleClick}
                >
                    {prettify(task, true)}
                </ListGroupItem>
            </React.Fragment>
        );
    }
}
