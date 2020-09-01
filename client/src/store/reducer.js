import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  error: "",
};

const middleware = [thunk];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case "GET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

export const store = createStore(
  reducer,
  initialState,
  compose(applyMiddleware(...middleware))
);
