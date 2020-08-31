import React from "react";
import "./ImageCard.css";
import { Button } from "react-bootstrap";

const ImageCard = (props) => {
  return (
    <div className="imgCard">
      <div>
        <img src={props.src} alt={props.caption} />
      </div>
      {/* <div className="photoDetails"> */}
      <div className="caption">
        <p>{props.caption}</p>
      </div>
      {props.tags.length > 0 && (
        <div>
          {props.tags.map((tag, index) => (
            <Button className="tagBtn" variant="secondary" key={index}>
              {tag}
            </Button>
          ))}
        </div>
      )}
      {props.ownerID === props.userID && (
        <div>
          <button
            type="button"
            className="btn btn-danger delete"
            onClick={() => props.delete(props.photoID)}
          >
            Delete
          </button>
        </div>
      )}
      <div className="shared-container">
        <p className="shared-text">shared by</p>
        <button className="imgcardBtn" onClick={props.userImage}>
          <p>{props.ownerName}</p>
        </button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ImageCard;
