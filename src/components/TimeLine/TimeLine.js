import React, { Component } from "react";
import "../TimeLine/TimeLine.css";
import ImageCard from "../ImageCard/ImageCard";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

class TimeLine extends Component {
  constructor() {
    super();
    // Don't call this.setState() here!
    this.state = {
      images: [],
      search: "",
      noImageMsg: "",
      name: "",
    };
  }

  handleSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
    this.search();
  };

  mergeArrays = (array1, array2) => {
    var result = array1;
    for (var i = 0; i < array2.length; i++) {
      if (result.indexOf(array2[i]) < 0) {
        result.push(array2[i]);
      }
    }
    return result;
  };

  search = () => {
    axios.get("/photos").then((response) => {
      const images = response.data;
      const caption = this.state.search;
      const filteredImages = images.filter(function (image) {
        return (
          image.caption.includes(caption) || caption.includes(image.caption)
        );
      });
      const filteredImagesByTags = images.filter(
        this.searchTags.bind(this, caption)
      );
      const searchResults = this.mergeArrays(
        filteredImages,
        filteredImagesByTags
      );
      this.setState({
        images: searchResults,
      });
    });
  };

  searchTags = (caption, image) => {
    for (let i = 0; i < image.tags.length; i++) {
      if (image.tags[i].includes(caption) || caption.includes(image.tags[i])) {
        return true;
      }
    }
    return false;
  };

  searchImages = (userImages, image) => {
    for (let i = 0; i < userImages.length; i++) {
      if (image.filename === userImages[i]) {
        return true;
      }
    }
    return false;
  };

  logout = () => {
    axios.get("/logout").then((response) => {
      if (response.data.message === "Success") {
        this.props.history.push("/");
      }
    });
  };

  myImages = () => {
    this.restorePhotos();
    if (this.state.images.length > 0) {
      this.setState({
        noImageMsg: "You have no images! Upload one to view!",
      });
    }
    axios.get("/images/my-images").then((response) => {
      const images = this.state.images;
      if (response.data.userImages.length > 0) {
        const userImages = response.data.userImages;
        const filteredImages = images.filter(
          this.searchImages.bind(this, userImages)
        );
        this.setState({
          images: filteredImages,
          noImageMsg: "",
        });
      } else {
        this.setState({
          noImageMsg: "You have no images! Upload one to view!",
        });
      }
    });
  };

  getUserImage = (id) => {
    axios.get("/images/" + id).then((response) => {
      if (response.data.userImages.length > 0) {
        const userImages = response.data.userImages;
        this.setState({
          images: userImages,
          noImageMsg: "",
        });
      } else {
        console.log("no images");
      }
    });
  };

  restorePhotos = () => {
    axios.get("/photos").then((response) => {
      this.setState({ images: response.data, noImageMsg: "" });
    });
  };

  checkUserLoggedIn = () => {
    axios
      .get("/timeline")
      .then((response) => {
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
      })
      .catch((error) => console.log("log in error", error.message));
  };

  componentDidMount() {
    this.checkUserLoggedIn();
    this.restorePhotos();
  }

  render() {
    const images = this.state.images;
    return (
      <div>
        <nav className="navigation-bar-list">
          <div className="my-info">
            <button className="navbar-link" onClick={this.restorePhotos}>
              Home
            </button>

            <button className="navbar-link" onClick={this.myImages}>
              My Images
            </button>
            {this.state.name && <p className="name">{this.state.name}</p>}
          </div>
          <div>
            <button className="navbar-link" onClick={this.logout}>
              Log Out
            </button>
          </div>
        </nav>
        <div className="gallery">
          {this.state.noImageMsg.length > 0 && (
            <p className="noImgMsg">{this.state.noImageMsg}</p>
          )}
          <div className="search-container">
            <input
              type="text"
              onChange={this.handleSearch}
              value={this.state.search}
              placeholder="Search by tag or caption"
              className="search-input"
            />
            <button className="action-button" onClick={this.search}>
              Search
            </button>
            <Link to={"/upload"}>
              <button className="action-button">Upload</button>
            </Link>
          </div>

          <div className="image-container">
            {images.map((file, index) => {
              return (
                <ImageCard
                  src={"/image/" + file.filename}
                  caption={file.caption}
                  key={index}
                  tags={file.tags}
                  ownerName={file.ownerName}
                  userImage={() => this.getUserImage(file.ownerID)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TimeLine);
