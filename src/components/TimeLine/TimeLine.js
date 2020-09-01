import React, { Component } from "react";
import "../TimeLine/TimeLine.css";
import ImageCard from "../ImageCard/ImageCard";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../store/actions";

class TimeLine extends Component {
  constructor() {
    super();
    // Don't call this.setState() here!
    this.state = {
      images: [],
      search: "",
      noImageMsg: "",
      myImagesPage: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.reducer.isAuthenticated !== this.props.reducer.isAuthenticated
    ) {
      this.props.history.push("/");
    }
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
    console.log("user is", this.props.reducer.user);
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
    this.props.logoutUser();
  };

  myImages = () => {
    const body = {
      email: this.props.reducer.user.email,
    };
    axios.post("/images/my-images", body).then((response) => {
      axios.get("/photos").then((photoResponse) => {
        const images = photoResponse.data;
        if (response.data.userImages.length > 0) {
          console.log("here");
          const userImages = response.data.userImages;
          const filteredImages = images.filter(
            this.searchImages.bind(this, userImages)
          );
          this.setState({
            images: filteredImages,
            noImageMsg: "",
            myImages: true,
          });
        } else {
          this.setState({
            noImageMsg: "You have no images! Upload one to view!",
            myImages: true,
            images: [],
          });
          console.log("msg", this.state.noImageMsg);
        }
      });
    });
  };

  getUserImage = (id) => {
    axios.get("/images/" + id).then((response) => {
      if (response.data.userImages.length > 0) {
        const userImages = response.data.userImages;
        this.setState({
          images: userImages,
          noImageMsg: "",
          myImages: true,
        });
      }
    });
  };

  restorePhotos = () => {
    axios.get("/photos").then((response) => {
      this.setState({ images: response.data, noImageMsg: "", myImages: false });
    });
  };

  deleteImage = (id) => {
    axios
      .delete("/image/" + id)
      .then(() => {
        this.restorePhotos();
      })
      .catch((error) => console.log("delete error", error.message));
  };

  componentDidMount() {
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
            {this.props.reducer.user.name && (
              <p className="name">{this.props.reducer.user.name}</p>
            )}
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
          {!this.state.myImages && (
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
          )}

          <div className="image-container">
            {images.map((file, index) => {
              return (
                <ImageCard
                  src={"/image/" + file.filename}
                  caption={file.caption}
                  key={index}
                  tags={file.tags}
                  ownerName={file.ownerName}
                  ownerID={file.ownerID}
                  userID={this.props.reducer.user.id}
                  photoID={file.id}
                  userImage={() => this.getUserImage(file.ownerID)}
                  delete={this.deleteImage}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  reducer: state,
});

TimeLine.propTypes = {
  reducer: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, { logoutUser })(TimeLine));
