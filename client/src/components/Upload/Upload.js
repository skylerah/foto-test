import React, { Component } from "react";
import axios from "axios";
import "../Upload/Upload.css";
import { withRouter } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../store/actions";
import logo from "../../assets/images/logoBlack.png";

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      filename: "",
      file: {},
      caption: "",
      tags: [],
      inputfile: [],
      error: "",
    };
  }

  //log user out if session expires/user clicks logout
  componentDidUpdate(prevProps) {
    if (
      prevProps.reducer.isAuthenticated !== this.props.reducer.isAuthenticated
    ) {
      this.props.history.push("/");
    }
  }

  post = (e) => {
    e.preventDefault();
    const file = this.state.inputfile;
    const formData = new FormData();

    formData.append("img", file[0]);
    //only post if a file has been selected
    if (typeof file[0] === "undefined") {
      this.setState({ error: "Please select an image to upload!" });
    } else {
      this.setState({ error: "" });
      axios.post("/upload", formData).then(
        (response) => {
          this.setState({ file: response.data.file });
          const data = this.state.file;
          data.caption = this.state.caption;
          data.tags = this.state.tags;
          data.ownerName = this.props.reducer.user.name;
          data.ownerID = this.props.reducer.user.id;

          axios.post("/photo", data).then(
            () => {
              this.props.history.push("/timeline");
            },
            (error) => {
              console.log(error);
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  //log user out
  logout = () => {
    this.props.logoutUser();
  };

  handleChange = (e) => {
    const filepath = e.target.value.split("\\");
    this.setState({
      filename: filepath[filepath.length - 1],
      inputfile: e.target.files,
    });
  };

  handleCaptionChange = (e) => {
    this.setState({ caption: e.target.value });
  };

  //add tags to state
  addTags = (tags) => {
    this.setState({
      tags,
    });
  };
  render() {
    return (
      <div>
        <nav className="navigation__bar__list">
          <div className="my__info">
            <a href="/timeline">
              <img src={logo} alt="logo" className="logo" />
            </a>
            {this.props.reducer.user.name.length > 0 && (
              <p className="name">{this.props.reducer.user.name}</p>
            )}
          </div>
          <div>
            <button className="navbar__link" onClick={this.logout}>
              Log Out
            </button>
          </div>
        </nav>
        <div className="upload__container">
          {this.state.error.length > 0 && (
            <p className="upload__error">{this.state.error}</p>
          )}
          <h2 className="upload__title">Upload a picture</h2>
          <div className="form__container">
            <form
              encType="multipart/form-data"
              onSubmit={this.post}
              className="form__content"
            >
              <div className="custom-file inputfile__container">
                <input
                  type="file"
                  className="custom-file-input input"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                  onChange={this.handleChange}
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  {this.state.filename ? this.state.filename : "Choose File"}
                </label>
              </div>
              <div className="caption__container">
                <input
                  type="text"
                  onChange={this.handleCaptionChange}
                  value={this.state.caption}
                  className="caption__input"
                  placeholder="  Enter a caption for your image"
                  maxLength="50"
                />
              </div>
              <div className="tag__input">
                <ReactTagInput
                  placeholder="Enter tags to categorize/describe your image"
                  tags={this.state.tags}
                  onChange={(newTags) => this.addTags(newTags)}
                  maxTags={5}
                />
              </div>

              <button type="submit" className="upload__btn">
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  reducer: state,
});

Upload.propTypes = {
  reducer: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, { logoutUser })(Upload));
