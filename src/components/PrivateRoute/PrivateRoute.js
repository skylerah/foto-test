import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, reducer, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      reducer.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);
PrivateRoute.propTypes = {
  reducer: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  reducer: state,
});
export default connect(mapStateToProps)(PrivateRoute);
