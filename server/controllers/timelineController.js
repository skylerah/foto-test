const express = require("express");
const pino = require("express-pino-logger")();
const User = require("../models/User");

const app = express();
app.use(pino);
app.use(express.json());

//middleware function for sessions
app.use(function (req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function (err, user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        res.locals.user = user;
      }
      next();
    });
  } else {
    next();
  }
});

app.get("/timeline", (req, res) => {
  const user = req.session.user;
  if (typeof user !== "undefined") {
    user.password = "";
  }
  res.json({ status: "timeline page", user });
});

module.exports = app;
