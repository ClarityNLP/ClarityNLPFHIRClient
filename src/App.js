import React, { Component } from 'react';
import { Navbar, NavbarBrand, FormGroup, Input, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button}
    from 'reactstrap';
import logo from './gtri.png';
import './App.css';
import ToggleButton from 'react-toggle-button';
import { Base64 } from 'js-base64';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props);

        this.default_fhir_url = 'https://apps.hdap.gatech.edu/gt-fhir/fhir';
        this.default_claritynlpaas_url = 'https://nlp.hdap.gatech.edu/job/';
        this.default_patient = '14628';
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
            patient: '',
            error: '',
            documents: [],
            results: [],
            running: false
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
    }

    showErrorMessage(err){
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
        if (this.state.documents.length === 0){
            return "Error: No Documents"
        }
        return "";
    }

    runPhenotype() {
        if (this.canRun()) {
            this.setState({
                running: true
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
                axios.post(this.default_claritynlpaas_url + this.state.task, {
                    reports: docs
                }).then(response => {
                    console.log(response.data);
                    this.setState({
                        results: response.data,
                        running: false
                    })
                }).catch(err => {
                    this.showErrorMessage(err.toString());
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
        let txt = e.target.firstChild.textContent;
        this.setState({
            task: txt
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

    keyUpHandler(e){
        if (e.key === 'Enter') {
            this.patientInputChanged();
        }
    };


    patientUpdated() {
        let patient =  this.smart.patient;
        let pt = patient.read();

        pt.done(p => {
            console.log(p);
            this.setState({
                patient: p['id']
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
                task: ''
            }),
            () => {this.modeToggle()});

    }

    componentDidMount() {
        this.modeToggle();
        axios.get(this.default_claritynlpaas_url + 'list/all').then(response => {
            this.setState({
                tasks: response.data
            })
        });
    }

  render() {
    let items = this.state.tasks.map((t) => {
        return (<DropdownItem key={t} onClick={this.setTask}>
            {t}
        </DropdownItem>);
    });
    return (
      <div className="App">
          <Navbar expand="md" className="App-header light bg-info" style={{ height: "60px" }}>
              <NavbarBrand className="mr-auto"><img src={logo} className="App-logo" alt="logo" />
                  <div className="App-name">ClarityNLP FHIR Client</div></NavbarBrand>
              <div style={{color:"black"}}>
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
                      onToggle={this.onToggle} />

              </div>
          </Navbar>

          <div className="App-intro container-fluid">
              <div className="row" style={{paddingTop:10}}>{" "}</div>
              {this.state.test_mode ?
                <div>
                    <div className="form">
                        <FormGroup>
                            <Label for="patient">Patient:</Label>
                            <Input type="text" name="patient" id="patient"  className={"form-control"}
                                   onKeyUp={this.keyUpHandler} onChange={this.patientInputChanged}/>
                        </FormGroup>
                    </div>
                </div> :
                  <div>
                    {this.state.patient !== '' ?
                        <div><
                            Label>{"Patient: " + this.state.patient}</Label>

                        </div>: <div/>}
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
                                    { this.state.task === '' ?  'Phenotype  ' :  this.state.task}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {items}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>


                        <div>

                            <Button block onClick={this.runPhenotype}
                                    disabled={this.state.running}
                                className={ this.canRun() ? 'btn-success btn-lg' : 'btn-default btn-lg'}>
                                { this.state.running ? "Running..." :
                                    "Run " + (this.state.documents.length > 0 ?
                                    " (" + this.state.documents.length + ")" : "") }
                                </Button>
                            <br/>
                            <Label style={{fontSize:"10pt"}}>{this.state.error}</Label>
                        </div>



                    </div>
                  </div>

                  <div className="col-9">

                  </div>
              </div>
          </div>
      </div>
    );
  }
}

export default App;
