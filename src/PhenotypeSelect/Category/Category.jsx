import React, { Component } from "react";
import {
    Col,
    Card,
    CardHeader,
    CardBody,
    ListGroup,
    Collapse
} from "reactstrap";
import prettify from "../../utils/prettify";
import SelectButton from "./SelectButton";

const inititalState = {
    collapse: false
};

export default class Category extends Component {
    constructor(props) {
        super(props);

        this.state = inititalState;
    }

    toggle = () => {
        this.setState({
            collapse: !this.state.collapse
        });
    };

    render() {
        const { category, values } = this.props;

        return (
            <Col md="6" key={category} className="category">
                <Card>
                    <CardHeader onClick={this.toggle}>
                        <h3>{prettify(category, true)}</h3>
                    </CardHeader>
                    <Collapse isOpen={this.state.collapse}>
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
                    </Collapse>
                </Card>
            </Col>
        );
    }
}
