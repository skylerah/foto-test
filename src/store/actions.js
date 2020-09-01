import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

export const updateName = (name) => {
  return {
    type: "UPDATE_NAME",
    value: name,
  };
};

// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/login", userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      const { message } = res.data;
      if (typeof message !== "undefined") {
        dispatch({
          type: "GET_ERRORS",
          payload: message,
        });
      } else {
        localStorage.setItem("jwtToken", token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
      }
    })
    .catch(
      (err) => err.response && dispatch(getError(err.response.data.message))
    );
};

// Register User
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/signup", userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    }) // re-direct to login on successful register
    .catch(
      (err) => err.response && dispatch(getError(err.response.data.message))
    );
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  console.log("decoded", decoded);
  return {
    type: "SET_CURRENT_USER",
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const getError = (error) => {
  return {
    type: "GET_ERROR",
    payload: error,
  };
};
