import { applyMiddleware, compose, createStore } from "redux";

// MIDDLEWARES
import thunk from "redux-thunk";
import axiosMiddleware from "redux-axios-middleware";
import reducer from "../reducers";

const initialState = {};

export default function configureStore(apiClient) {
    const store = createStore(
        reducer,
        initialState,
        compose(applyMiddleware(thunk, axiosMiddleware(apiClient)))
    );

    return store;
}
