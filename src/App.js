import React, {Component} from 'react';
import {Navbar, NavbarBrand, FormGroup, Input, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button,
    Table, Modal, ModalHeader, ModalBody, ModalFooter}
    from 'reactstrap';
import logo from './gtri.png';
import './App.css';
import ToggleButton from 'react-toggle-button';
import {Base64} from 'js-base64';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props);

        this.default_fhir_url = 'https://apps.hdap.gatech.edu/gt-fhir/fhir';
        this.default_claritynlpaas_url = 'https://nlp.hdap.gatech.edu/job/';
        // this.default_claritynlpaas_url = 'http://localhost:5000/job/';
        this.default_patient = '14628';
        this.standard_column_names = [ 'Feature', 'Section', 'Sentence', 'Value', ''];
        this.standard_columns = [ 'nlpql_feature', 'section', 'sentence', 'value', '$'];

        this.smart = {};

        if (window.FHIR) {
            window.FHIR.oauth2.authorize({
                "client_id": "my_web_app",
                "scope": "patient/*.read"
            });
        }

        this.state = {
            tasks: [],
            test_mode: false,
            task_dropdown_open: false,
            task: '',
            pretty_task: '',
            patient: '',
            patient_name: '',
            error: '',
            category: '',
            documents: [],
            results: [],
            running: false,
            items_map: new Map(),
            result_message: '',
            result_modal: false,
            active_row: {}
        };
        this.onToggle = this.onToggle.bind(this);
        this.modeToggle = this.modeToggle.bind(this);
        this.patientUpdated = this.patientUpdated.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.setTask = this.setTask.bind(this);
        this.canRun = this.canRun.bind(this);
        this.getRunErrorMessage = this.getRunErrorMessage.bind(this);
        this.runPhenotype = this.runPhenotype.bind(this);
        this.patientInputChanged = this.patientInputChanged.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.showResultMessage = this.showResultMessage.bind(this);
        this.prettify = this.prettify.bind(this);
        this.compareColumn = this.compareColumn.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.showModalDetail = this.showModalDetail.bind(this);
    }

    showModalDetail(row) {
        this.setState({
            active_row: row,
            result_modal: true
        });
    }

    toggleModal() {
        this.setState({
            result_modal: !this.state.result_modal
        })
    }

    compareColumn(a, b, key) {
        if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
            let a_val = a[key].toString().toLowerCase();
            let b_val = b[key].toString().toLowerCase();
            if (a_val < b_val) {
                return -1;
            }
            if (a_val > b_val) {
                return 1;
            }
        }

        return 0
    }

    prettify(text, capitalize) {
        let spaced = text.split('_').join(' ');
        if (capitalize) {
            return spaced.toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        } else {
            return spaced;
        }
    }

    showErrorMessage(err) {
        console.log(err);
        this.setState({
            error: err
        }, () => {
            setTimeout(() => {
                this.setState({
                    error: '',
                })
            }, 2500)
        });
    }

    showResultMessage(err) {
        console.log(err);
        this.setState({
            result_message: err
        }, () => {
            setTimeout(() => {
                this.setState({
                    result_message: '',
                })
            }, 2500)
        });
    }

    canRun() {
        return this.state.task !== '' && this.state.patient !== '' && this.state.documents.length > 0;
    }

    getRunErrorMessage() {
        if (this.state.task === '') {
            return "Error: No Phenotype Selected"
        }
        if (this.state.patient === '') {
            return "Error: No Patient Selected"
        }
        if (this.state.documents.length === 0) {
            return "Error: No Documents"
        }
        return "";
    }

    runPhenotype() {
        if (this.canRun()) {
            this.setState({
                running: true,
                result_message: '',
                results: [],
                active_row: {}
            }, () => {

                let docs = this.state.documents.map((d) => {
                    if (d.content && d.content.length > 0) {
                        let txt = '';
                        for (let i in d.content) {
                            if (d.content.hasOwnProperty(i)) {
                                if (d.content[i].hasOwnProperty('attachment')) {
                                    let att = d.content[i]['attachment'];

                                    txt = (txt + Base64.decode(att['data']) + '\n');
                                }
                            }
                        }

                        return txt;
                    }
                    return ''
                });
                // console.log(docs);
                let normalized_task = this.state.category;
                if (normalized_task.length > 0) {
                    normalized_task += '/';
                }
                normalized_task += this.state.task;
                normalized_task = normalized_task.split('/').join('~');
                axios.post(this.default_claritynlpaas_url + normalized_task, {
                    reports: docs
                }, {
                    timeout: 1000000
                }).then(response => {
                    console.log(response.data);
                    let results = response.data;
                    let matches = results.filter(r => {
                        return r.hasOwnProperty('nlpql_feature') && r['nlpql_feature'] !== null && r['nlpql_feature']
                            !== "null";
                    }).sort((a, b) => {
                        let sort_val = 0;

                        for (let c in this.standard_columns) {
                            if (sort_val !== 0) {
                                break;
                            }
                            sort_val = this.compareColumn(a, b, this.standard_columns[c])
                        }


                        return sort_val;
                    });
                    if (matches.length === 0) {
                        this.setState({
                            results: matches,
                            running: false,
                            result_message: 'No matches for ' + this.state.pretty_task + '.'
                        })
                    } else {
                        this.setState({
                            results: matches,
                            running: false,
                            result_message: ''
                        })
                    }

                }).catch(err => {
                    this.showResultMessage(err.toString());
                    this.setState({
                        results: [],
                        running: false

                    })
                });
            })
        } else {
            this.showErrorMessage(this.getRunErrorMessage())
        }
    }


    setTask(e) {
        let category = e.target.getAttribute('category');
        let task = e.target.getAttribute('task');
        let pretty_task = e.target.getAttribute('pretty_task');
        this.setState({
            category: category,
            task: task,
            pretty_task: pretty_task
        });
    }

    patientInputChanged() {
        let val = document.getElementById('patient').value;
        this.setState({
            patient: val
        }, () => {
            this.smart = window.FHIR.client({
                serviceUrl: this.default_fhir_url,
                patientId: val
            });
            this.patientUpdated();
        });
    }

    keyUpHandler(e) {
        if (e.key === 'Enter') {
            this.patientInputChanged();
        }
    };


    patientUpdated() {
        let patient = this.smart.patient;
        let pt = patient.read();

        pt.done(p => {
            let first_name = '';
            let last_name = '';

            if (typeof p.name[0] !== 'undefined') {
                let given = p.name[0].given;
                let family = p.name[0].family;
                if (typeof given === "string") {
                    first_name = given
                } else {
                    first_name = given.join(' ')
                }
                if (typeof family === "string") {
                    last_name = family
                } else {
                    last_name = family.join(' ');
                }

            }
            this.setState({
                patient: p['id'],
                patient_name: (this.prettify(last_name, true) + ", " + this.prettify(first_name, true))
            }, () => {
                let docs = this.smart.patient.api.fetchAll({
                    type: 'DocumentReference'
                });
                docs.done(d => {
                    this.setState({
                        documents: d
                    });
                });
            });
            if (this.state.test_mode) {
                document.getElementById('patient').value = p['id'];
            }
        });


    }

    modeToggle() {
        if (this.state.test_mode) {
            this.smart = window.FHIR.client({
                serviceUrl: this.default_fhir_url,
                patientId: this.default_patient
            });
            if (this.state.patient === '') {
                document.getElementById('patient').value = this.default_patient;
            } else {
                document.getElementById('patient').value = this.state.patient;
            }
            this.patientUpdated();

        } else {
            if (window.FHIR) {
                window.FHIR.oauth2.ready(smart => {
                    console.log('fhir oauth2 ready');
                    // now do something cool
                    this.smart = smart;

                    this.patientUpdated();

                });
            }
        }
    }

    toggleDropdown() {
        this.setState(prevState => ({
            task_dropdown_open: !prevState.task_dropdown_open
        }));
    }

    onToggle() {
        console.log('ontoggle, test_mode = ' + !this.state.test_mode);
        this.setState(prevState => ({
                test_mode: !this.state.test_mode,
                patient: '',
                patient_name: '',
                task: '',
                pretty_task: '',
                category: '',
                result_message: '',
                results: [],
                active_row: {}
            }),
            () => {
                this.modeToggle()
            });

    }

    componentDidMount() {
        this.modeToggle();
        axios.get(this.default_claritynlpaas_url + 'list/all').then(response => {
            let items_map = new Map();
            let categories = [];
            for (let i in response.data) {
                if (response.data.hasOwnProperty(i)) {
                    let spl = response.data[i].split('/');
                    let category = spl[0];
                    if (!categories.includes(category)) {
                        categories.push(category);
                        items_map.set(category, [])
                    }
                    let value = spl.slice(1).join('/');
                    items_map.get(category).push(value);
                }
            }
            // console.log(items_map);
            this.setState({
                tasks: response.data,
                items_map: items_map
            })
        });
    }

    render() {
        let items = [];
        for (let [k, values] of this.state.items_map) {
            if (items.length > 0) {
                items.push(<DropdownItem divider key={"divider" + k}/>)
            }
            items.push(<DropdownItem header key={"header" + k}><b>{this.prettify(k, true)}</b></DropdownItem>);
            for (let v in values) {
                if (values.hasOwnProperty(v)) {
                    let value = values[v];
                    let pretty_value = this.prettify(value);
                    items.push(
                        <DropdownItem key={'value' + value} onClick={this.setTask} category={k} task={value}
                                      pretty_task={pretty_value}>
                                      {pretty_value}</DropdownItem>
                    )
                }
            }
        }

        let result_header_items = [];
        for (let hi in this.standard_column_names) {
            result_header_items.push(
                <th key={'header_item' + hi}>
                    {this.standard_column_names[hi]}
                </th>
            )
        }

        let keys = Object.entries(this.state.active_row).sort();
        let modal_detail = keys.map(k => {
            let modal_value = k[1];
            let key = k[0];
            if (modal_value) {
                if (typeof modal_value === "object") {
                    modal_value = JSON.stringify(modal_value)
                } else {
                    modal_value = modal_value.toString()
                }
            } else {
                modal_value = ""
            }

            if (typeof key === "object") {
                key = JSON.stringify(k)
            }
            return (
                <tr key={'modal' + key}>
                    <td><b>{key}</b></td>
                    <td>{modal_value}</td>
                </tr>
            )
        });

        let column_keys = this.standard_columns;
        let result_items = this.state.results.map((r, it) => {
            let id = it;
            let row_values = column_keys.map((c, rit) => {
               if (r.hasOwnProperty(c)) {
                   let row_value = r[c];
                   let className = '';
                   if (c === "section") {
                       row_value = row_value.split("_").join(" ")
                   }
                   if (c === "nlpql_feature") {
                       className = "bold_label"
                   }
                   if (c === "section") {
                       className = "section_column"
                   }
                   if (c === "value") {
                       className = "value_column"
                   }
                   return <td key={id + '.' + rit} className={className}>{row_value}</td>
               } else {
                   if (c === "$") {
                       return <td key={id + '.' + rit} style={{cursor: "pointer"}} onClick={() => {
                            this.showModalDetail(r)
                            }}>
                           <i className="fas fa-bars"/>{ "  " }</td>;
                   } else {
                       return <td key={id + '.' + rit}>&nbsp;</td>
                   }
               }
            });
            return <tr key={'row' + id}>
                {row_values}
            </tr>
        });

        return (
            <div className="App">
                <Navbar expand="md" className="App-header light bg-info" style={{height: "60px"}}>
                    <NavbarBrand className="mr-auto"><img src={logo} className="App-logo" alt="logo"/>
                        <div className="App-name">ClarityNLP FHIR Client</div>
                    </NavbarBrand>
                    <div style={{color: "black"}}>
                        <ToggleButton

                            inactiveLabel={"Test"}
                            activeLabel={"EMR"}
                            colors={{
                                activeThumb: {
                                    base: 'rgb(250, 250, 250)',
                                },
                                inactiveThumb: {
                                    base: 'rgb(250, 250, 250)',
                                },
                                active: {
                                    base: '#34919f',
                                    hover: '#34919f',
                                },
                                inactive: {
                                    base: 'rgb(65, 66, 68)',
                                    hover: 'rgb(65, 66, 68)',
                                }
                            }}
                            value={!this.state.test_mode}
                            onToggle={this.onToggle}/>

                    </div>
                </Navbar>

                <div className="App-intro container-fluid">
                    <div className="row" style={{paddingTop: 10}}>{" "}</div>
                    {this.state.test_mode ?
                        <div>
                            <div className="form">
                                <FormGroup>
                                    <Label for="patient"><Label>{"Patient" +
                                    (this.state.patient_name !== '' ?
                                        " (" + this.state.patient_name + "):" : ': ')
                                    }</Label></Label>
                                    <Input type="text" name="patient" id="patient" className={"form-control"}
                                           onKeyUp={this.keyUpHandler} onChange={this.patientInputChanged}/>
                                </FormGroup>
                            </div>
                        </div> :
                        <div>
                            {this.state.patient !== '' ?
                                <div><Label>{"Patient: " + this.state.patient +
                                        (this.state.patient_name !== '' ?
                                        " (" + this.state.patient_name + ")" : '')
                                }</Label>

                                </div> : <div/>}
                        </div>
                    }
                    <div className="row">
                        <div className="col-3">
                            <div className="form">
                                <FormGroup>
                                    <Label>Select Phenotype:</Label>
                                    <Dropdown
                                        isOpen={this.state.task_dropdown_open} toggle={this.toggleDropdown}>
                                        <DropdownToggle outline

                                                        caret>
                                            {this.state.pretty_task === '' ? 'Phenotype  ' : this.state.pretty_task}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {items}
                                        </DropdownMenu>
                                    </Dropdown>
                                </FormGroup>


                                <div>
                                    <Button block onClick={this.runPhenotype}
                                            disabled={this.state.running}
                                            className={this.canRun() ? 'btn-success btn-lg' : 'btn-default btn-lg'}>
                                        {this.state.running ? <span><i className="fa fa-circle-notch fa-spin"/></span>:
                                            "Run " + (this.state.documents.length > 0 ?
                                            " (" + this.state.documents.length + ")" : "")}
                                    </Button>
                                    <br/>
                                    <Label style={{fontSize: "10pt"}}>{this.state.error}</Label>
                                </div>


                            </div>
                        </div>

                        <div className="col-9">
                            { this.state.result_message !== '' ?
                                <div>
                                    <Label>{this.state.result_message}</Label>
                                </div> :
                                <div>
                                    {this.state.results.length === 0 ?
                                        <span/> :
                                        <div>
                                            <Table hover size="sm">
                                                <thead>
                                                <tr>
                                                    {result_header_items}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    {result_items}
                                                </tbody>
                                            </Table>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.result_modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>View Detail</ModalHeader>
                    <ModalBody>
                        <Table hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {modal_detail}
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default App;
