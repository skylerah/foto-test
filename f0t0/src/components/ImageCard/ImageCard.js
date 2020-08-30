import React from "react";
import "./ImageCard.css";

const ImageCard = (props) => {
  return (
    <div className="imgCard">
      <div>
        <img src={props.src} alt={props.caption} />
      </div>
      <div className="caption">
        <p>{props.caption}</p>
      </div>
    </div>
  );
};

export default ImageCard;
