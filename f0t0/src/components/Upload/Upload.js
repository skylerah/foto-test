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
    };

    this.post = this.post.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.addTags = this.addTags.bind(this);
  }

  componentDidMount() {
    axios.get("/upload").then((response) => {
      const user = response.data.user;
      console.log("user", user);
      if (!user || Object.keys(user).length === 0) {
        this.props.history.push("/");
      }
    });
  }

  post(e) {
    e.preventDefault();
    const file = document.getElementById("inputGroupFile01").files;
    const formData = new FormData();

    formData.append("img", file[0]);

    axios.post("/upload", formData).then(
      (response) => {
        console.log("res", response.data.file);
        this.setState({ file: response.data.file });
        const data = this.state.file;
        data.caption = this.state.caption;
        data.tags = this.state.tags;
        console.log("photo data", data);
        axios.post("/photo", data).then(
          (response) => {
            console.log("photo res", response);
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

    console.log("file frontend", file[0]);
  }

  handleChange(e) {
    const filepath = e.target.value.split("\\");
    this.setState({ filename: filepath[filepath.length - 1] });
  }

  handleCaptionChange(e) {
    this.setState({ caption: e.target.value });
  }

  addTags(tags) {
    this.setState({
      tags,
    });
  }
  render() {
    return (
      <div>
        <nav className="navigation-bar-list">
          <div className="my-info">
            <Link to={"/timeline"}>
              <button className="navbar-link">Home</button>
            </Link>
            <p className="name">Temisan Iwere</p>
          </div>
          <div>
            <a className="logout navbar-link" href="/">
              Log Out
            </a>
          </div>
        </nav>
        <form encType="multipart/form-data" onSubmit={this.post}>
          <h1>Upload a picture</h1>
          <div className="form-content">
            <div className="custom-file">
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
            <div>
              <input
                type="text"
                onChange={this.handleCaptionChange}
                value={this.state.caption}
                className="input"
                placeholder="Enter a caption for your image"
              />
            </div>
            <div className="input">
              <ReactTagInput
                tags={this.state.tags}
                onChange={(newTags) => this.addTags(newTags)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Upload
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(Upload);
