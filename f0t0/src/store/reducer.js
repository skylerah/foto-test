import { createStore } from "redux";

const initiatlState = {
  name: "",
};

function reducer(state = initiatlState, action) {
  switch (action.type) {
    case "UPDATE_NAME":
      state.name = action.value;
      break;
    default:
      return state;
  }
}

export const store = createStore(reducer);
