import React, { Component } from "react";
import { Card, CardHeader, CardBody, ListGroup } from "reactstrap";
import prettify from "../../utils/prettify";
import SelectButton from "./SelectButton";

import "./main.css";

const inititalState = {};

export default class Category extends Component {
    constructor(props) {
        super(props);

        this.state = inititalState;
    }

    render() {
        const { category, values } = this.props;

        return (
            <Card className="category">
                <CardHeader>
                    <h3>{prettify(category, true)}</h3>
                </CardHeader>
                <CardBody>
                    <ListGroup flush>
                        {values.map(value => {
                            return (
                                <SelectButton
                                    key={value}
                                    task={value}
                                    category={category}
                                />
                            );
                        })}
                    </ListGroup>
                </CardBody>
            </Card>
        );
    }
}
