import React from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import TimeLine from "../TimeLine/TimeLine";
import Upload from "../Upload/Upload";
import NotFound from "../NotFound/NotFound";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";
import { setCurrentUser, logoutUser } from "../../store/actions";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { store } from "../../store/reducer";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./";
  }
}

const HomePage = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/sign-up" component={SignUp} />
        <PrivateRoute exact path="/timeline" component={TimeLine} />
        <PrivateRoute exact path="/upload" component={Upload} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default HomePage;
