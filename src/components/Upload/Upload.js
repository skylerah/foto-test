import React, { Component } from "react";
import axios from "axios";
import "../Upload/Upload.css";
import { Link, withRouter } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

class Upload extends Component {
  constructor() {
    super();
    // Don't call this.setState() here!
    this.state = {
      filename: "",
      file: {},
      caption: "",
      tags: [],
      user: {},
      inputfile: [],
      name: "",
    };
  }

  componentDidMount() {
    this.checkUserLoggedIn();
  }

  checkUserLoggedIn = () => {
    axios.get("/upload").then((response) => {
      const user = response.data.user;
      if (
        typeof user === "undefined" ||
        !user ||
        Object.keys(user).length === 0
      ) {
        this.props.history.push("/");
      } else {
        this.setState({ name: user.firstName + " " + user.lastName });
      }
    });
  };

  post = (e) => {
    e.preventDefault();
    const file = this.state.inputfile;
    const formData = new FormData();

    formData.append("img", file[0]);

    axios.post("/upload", formData).then(
      (response) => {
        this.setState({ file: response.data.file });
        const data = this.state.file;
        data.caption = this.state.caption;
        data.tags = this.state.tags;
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

  addTags = (tags) => {
    this.setState({
      tags,
    });
  };
  render() {
    this.checkUserLoggedIn();
    return (
      <div>
        <nav className="navigation-bar-list">
          <div className="my-info">
            <Link to={"/timeline"}>
              <button className="navbar-link">Home</button>
            </Link>
            {this.state.name.length > 0 && (
              <p className="name">{this.state.name}</p>
            )}
          </div>
          <div>
            <a className="logout navbar-link" href="/">
              Log Out
            </a>
          </div>
        </nav>
        <div className="upload-container">
          <h2 className="upload-title">Upload a picture</h2>
          <div className="form-container">
            <form
              encType="multipart/form-data"
              onSubmit={this.post}
              className="form-content"
            >
              <div className="custom-file inputfile-container">
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
              <div className="caption-container">
                <input
                  type="text"
                  onChange={this.handleCaptionChange}
                  value={this.state.caption}
                  className="caption-input"
                  placeholder="  Enter a caption for your image"
                  maxLength="50"
                />
              </div>
              <div className="tag-input">
                <ReactTagInput
                  placeholder="Enter tags to categorize/describe your image"
                  tags={this.state.tags}
                  onChange={(newTags) => this.addTags(newTags)}
                  maxTags={5}
                />
              </div>

              <button type="submit" className="upload-btn">
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Upload);
