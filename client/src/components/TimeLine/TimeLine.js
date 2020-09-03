import React, { Component } from "react";
import "../TimeLine/TimeLine.css";
import ImageCard from "../ImageCard/ImageCard";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../store/actions";
import logo from "../../assets/images/logo.png";

class TimeLine extends Component {
  constructor() {
    super();
    this.state = {
      images: [],
      search: "",
      noImageMsg: "",
      myImagesPage: false,
    };
  }

  //if session expires, redirect user to sign in page
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

  //merge two arrays together with no duplicates
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
    //get all images
    axios.get("/photos").then((response) => {
      const images = response.data;
      const caption = this.state.search;
      //remove images that don't satisfy our search by caption
      const filteredImages = images.filter(function (image) {
        return (
          image.caption.includes(caption) || caption.includes(image.caption)
        );
      });

      //remove images that don't satisfy our search by tags
      const filteredImagesByTags = images.filter(
        this.searchTags.bind(this, caption)
      );

      //merge image search results for caption and tags
      const searchResults = this.mergeArrays(
        filteredImages,
        filteredImagesByTags
      );

      //update state with new images
      this.setState({
        images: searchResults,
      });
    });
  };

  //search list of tags
  searchTags = (caption, image) => {
    for (let i = 0; i < image.tags.length; i++) {
      if (image.tags[i].includes(caption) || caption.includes(image.tags[i])) {
        return true;
      }
    }
    return false;
  };

  //search for exact tag
  searchExactTags = (tag, image) => {
    for (let i = 0; i < image.tags.length; i++) {
      if (image.tags[i] === tag) {
        return true;
      }
    }
    return false;
  };

  //search images by filename
  searchImages = (userImages, image) => {
    for (let i = 0; i < userImages.length; i++) {
      if (image.filename === userImages[i]) {
        return true;
      }
    }
    return false;
  };

  //log user out
  logout = () => {
    this.props.logoutUser();
  };

  //display current user images
  myImages = () => {
    const body = {
      email: this.props.reducer.user.email,
    };
    axios.post("/images/my-images", body).then((response) => {
      //get all photos
      axios.get("/photos").then((photoResponse) => {
        const images = photoResponse.data;
        if (response.data.userImages.length > 0) {
          //if user images exists, filter images that don't belong to user
          const userImages = response.data.userImages;
          const filteredImages = images.filter(
            this.searchImages.bind(this, userImages)
          );

          //update state with user images
          this.setState({
            images: filteredImages,
            noImageMsg: "",
            myImages: true,
          });
        } else {
          //display message and update state images to empty
          this.setState({
            noImageMsg: "You have no images! Upload one to view!",
            myImages: true,
            images: [],
          });
        }
      });
    });
  };

  //display images uploaded by a particular user
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

  //display images with same tags
  getTagImages = (tag) => {
    axios.get("/photos").then((response) => {
      const images = response.data;
      //remove images that don't satisfy our search by tags
      const filteredImagesByTags = images.filter(
        this.searchExactTags.bind(this, tag)
      );

      this.setState({
        images: filteredImagesByTags,
        noImageMsg: "",
        myImages: true,
      });
    });
  };

  //update state with all images in repository
  restorePhotos = () => {
    axios.get("/photos").then((response) => {
      this.setState({ images: response.data, noImageMsg: "", myImages: false });
    });
  };

  //delete an image by id
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
              <img src={logo} alt="logo" className="logo" />
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
                  tagImage={this.getTagImages}
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
