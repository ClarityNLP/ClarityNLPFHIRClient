import { applyMiddleware, compose, createStore } from "redux";

// MIDDLEWARES
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import axiosMiddleware from "redux-axios-middleware";

import reducer from "../reducers";

const initialState = {};
const logger = createLogger();

export default function configureStore(apiClient) {
    const store = createStore(
        reducer,
        initialState,
        compose(applyMiddleware(thunk, axiosMiddleware(apiClient), logger))
    );

    return store;
}
