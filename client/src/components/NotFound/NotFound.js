import React from "react";
import "./NotFound.css";

const NotFound = (props) => {
  return (
    <div className="notFoundContainer">
      <div className="notFound">
        <p>Page Not Found!</p>
        <a href="/timeline">Go Home</a>
      </div>
    </div>
  );
};

export default NotFound;
