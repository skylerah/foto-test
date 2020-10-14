import React, { Component } from "react";
import "../TimeLine/TimeLine.css";
import ImageCard from "../ImageCard/ImageCard";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../store/actions";
import logo from "../../assets/images/logoBlack.png";

class TimeLine extends Component {
  constructor() {
    super();
    this.state = {
      images: [],
      search: "",
      noImageMsg: "",
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

  search = () => {
    //get all images
    axios.get("/photos").then((response) => {
      const images = response.data;
      const caption = this.state.search.toLowerCase();

      //remove images that don't satisfy our search by caption or tag
      const filteredImages = images.filter(function (image) {
        return (
          image.caption.toLowerCase().includes(caption) ||
          caption.includes(image.caption.toLowerCase()) ||
          image.tags.some((tag) => {
            return caption.includes(tag) || tag.toLowerCase().includes(caption);
          })
        );
      });

      //update state with new images
      this.setState({
        images: filteredImages,
      });
    });
  };

  //search for exact tag
  searchExactTags = (tag, image) => {
    for (let i = 0; i < image.tags.length; i++) {
      if (image.tags[i].toLowerCase() === tag.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  //log user out
  logout = () => {
    this.props.logoutUser();
  };

  //display images uploaded by a particular user
  getUserImage = (id, myImagesState) => {
    axios.get("/images/" + id).then((response) => {
      if (response.data.userImages.length > 0) {
        const userImages = response.data.userImages;
        this.setState({
          images: userImages,
          noImageMsg: "",
          userImages: true,
        });
      } else {
        if (myImagesState) {
          this.setState({
            noImageMsg: "You currently have no images! Upload one to view",
            userImages: true,
            images: [],
          });
        }
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
        userImages: true,
      });
    });
  };

  //update state with all images in repository
  restorePhotos = () => {
    axios.get("/photos").then((response) => {
      this.setState({
        images: response.data,
        noImageMsg: "",
        userImages: false,
      });
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
    const userID = this.props.reducer.user.id;
    return (
      <div>
        <nav className="navigation__bar__list">
          <div className="my__info">
            <button className="navbar__link" onClick={this.restorePhotos}>
              <img src={logo} alt="logo" className="logo" />
            </button>
            <button
              className="navbar__link"
              onClick={() => this.getUserImage(userID, true)}
            >
              My Images
            </button>
            {this.props.reducer.user.name && (
              <p className="name">{this.props.reducer.user.name}</p>
            )}
          </div>
          <div>
            <button className="navbar__link" onClick={this.logout}>
              Log Out
            </button>
          </div>
        </nav>
        <div className="gallery">
          {this.state.noImageMsg.length > 0 && (
            <p className="noImgMsg">{this.state.noImageMsg}</p>
          )}
          {!this.state.userImages && (
            <div className="search__container">
              <input
                type="text"
                onChange={this.handleSearch}
                value={this.state.search}
                placeholder="Search by tag or caption"
                className="search__input"
              />
              <Link to={"/upload"}>
                <button className="action__button">Upload</button>
              </Link>
            </div>
          )}

          <div className="image__container">
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
                  userImage={() => this.getUserImage(file.ownerID, false)}
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
