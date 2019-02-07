import React, { Component } from "react";

import prettify from "../utils/prettify";

const initialState = {
    smart: {},
    patient: {}
};

export default class Main_View extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentDidMount() {
        let tmp_smart = null;

        if (process.env.NODE_ENV === "development") {
            tmp_smart = window.FHIR.client({
                serviceUrl: process.env.REACT_APP_DEFAULT_FHIR_URL,
                patientId: "14628"
            });
        } else {
            if (window.FHIR) {
                window.FHIR.oauth2.ready(smart => {
                    tmp_smart = smart;
                });
            }
        }

        this.setState(
            {
                smart: tmp_smart
            },
            () => {
                this.setPatient();
            }
        );

        this.props.getLibrary();
    }

    setPatient = () => {
        const { patient } = this.state.smart;
        let patientText = patient.read();

        patientText.done(data => {
            let first_name = "";
            let last_name = "";
            let full_name = "";

            if (typeof data.name[0] !== "undefined") {
                let given = data.name[0]["given"];
                let family = data.name[0]["family"];

                if (typeof given === "string") {
                    first_name = given;
                } else {
                    first_name = given.join(" ");
                }

                if (typeof family === "string") {
                    last_name = family;
                } else {
                    last_name = family.join(" ");
                }
            }

            full_name =
                prettify(last_name, true) + ", " + prettify(first_name, true);

            this.setState({
                patient: {
                    ...this.state.patient,
                    id: data.id,
                    name: full_name
                }
            });

            let docs = this.state.smart.patient.api.fetchAll({
                type: "DocumentReference"
            });

            docs.done(data => {
                this.setState({
                    patient: {
                        ...this.state.patient,
                        documents: data
                    }
                });
            });
        });
    };

    render() {
        return (
            <div>
                <form>
                    <input type="text" />
                    <button>Submit</button>
                </form>
            </div>
        );
    }
}
