import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notFound__Container">
      <div className="notFound">
        <p>Page Not Found!</p>
        <a href="/timeline">Go Home</a>
      </div>
    </div>
  );
};

export default NotFound;
