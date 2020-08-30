import React from "react";
import "./HomePage.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import TimeLine from "../TimeLine/TimeLine";
import Upload from "../Upload/Upload";
import ImageCard from "../ImageCard/ImageCard";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/timeline" component={TimeLine} />
          <Route path="/upload" component={Upload} />
          <Route path="/card" component={ImageCard} />
        </Switch>
      </Router>
    );
  }
}

export default HomePage;
