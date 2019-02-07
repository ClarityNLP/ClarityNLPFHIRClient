import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

import configureStore from "./redux/store";
import App from "./App";

const apiClient = axios.create();

const store = configureStore(apiClient);

ReactDOM.render(<App store={store} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
