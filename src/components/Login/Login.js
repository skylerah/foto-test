import React, { Component } from "react";
import "../Login/Login.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "../../store/actions";
import PropTypes from "prop-types";
import logo from "../../assets/images/logoBlack.png";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }

  componentDidMount() {
    //if user is authenticated, redirect to timeline page
    if (this.props.isAuthenticated) {
      this.props.history.push("/timeline");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.props.history.push("/timeline");
    }
  }

  handleChange = (event, key) => {
    this.setState({ [key]: event.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(body);
  };

  render() {
    return (
      <div>
        <div className="App">
          <div className="auth-wrapper">
            <img className="logo-black" src={logo} alt="logo" />
            <div className="auth-inner">
              {this.props.error.length > 0 && (
                <p className="login-error">{this.props.error}</p>
              )}
              <form onSubmit={this.handleSubmit}>
                <h3>Sign In</h3>

                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={(e) => this.handleChange(e, "email")}
                    value={this.state.email}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => this.handleChange(e, "password")}
                    value={this.state.password}
                  />
                </div>

                <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customCheck1"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheck1"
                    >
                      Remember me
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Submit
                </button>
                <div className="alt-suggestions">
                  <p className="forgot-password text-left">
                    Don't have an account? <a href="/sign-up">Sign Up</a>
                  </p>
                  <p className="forgot-password text-right">
                    Forgot <a href="/">password?</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
  error: state.error,
});

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps, { loginUser })(Login));
