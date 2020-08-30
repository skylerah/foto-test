import React, { Component } from "react";
import "../SignUp/SignUp.css";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

class SignUp extends Component {
  constructor() {
    super();
    // Don't call this.setState() here!
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFirstNameChange(event) {
    this.setState({ firstName: event.target.value });
  }

  handleLastNameChange(event) {
    this.setState({ lastName: event.target.value });
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const body = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };

    axios.post("/signup", body).then(
      (response) => {
        console.log("response", response);
        if (response.data.status === "Success") {
          this.props.history.push("/timeline");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  render() {
    return (
      <div>
        <div className="App">
          <div className="auth-wrapper">
            <div className="auth-inner">
              <form onSubmit={this.handleSubmit}>
                <h3>Sign Up</h3>

                <div className="form-group">
                  <label>First name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={this.handleFirstNameChange}
                    value={this.state.firstName}
                  />
                </div>

                <div className="form-group">
                  <label>Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={this.handleLastNameChange}
                    value={this.state.lastName}
                  />
                </div>

                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={this.handleEmailChange}
                    value={this.state.email}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={this.handlePasswordChange}
                    value={this.state.password}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Sign Up
                </button>
                <Link className="nav-link" to={"/"}>
                  <p className="forgot-password text-right">
                    Already registered <a href="/">sign in?</a>
                  </p>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUp);
