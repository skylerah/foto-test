import React from "react";
import ReactDOM from "react-dom";
import HomePage from "../src/components/HomePage/HomePage";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/store/reducer";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
