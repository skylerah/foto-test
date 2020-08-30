const express = require("express");
const pino = require("express-pino-logger")();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const app = express();
app.use(pino);
app.use(express.json());

app.post("/signup", (req, res) => {
  console.log("body", req.body);
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user) {
      console.log("already exists");
      return res.status(200).json({ error: "exists" });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      });

      res.setHeader("Content-Type", "application/json");
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          // Store hash in your password DB.
          newUser.password = hash;
          newUser.save(function (err) {
            if (err) {
              var error = "Oops something bad happened! Try again";
              res.status(400).send(error);
            } else {
              error = "Sucess";
              req.session.user = newUser;
              req.session.user["password"] = "";
              console.log("session user signup", req.session.user);
              res.status(200).json({ status: error });
            }
          });
        });
      });
    }
  });
});

app.post("/login", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) {
      res.status(404).send({ error: "Invalid username or password" });
    } else {
      bcrypt.compare(req.body.password, user.password, function (
        err,
        response
      ) {
        if (response === true) {
          req.session.user = user;
          req.session.user["password"] = "";
          console.log("session user login", req.session.user);
          res.status(200).json({
            status: "Success",
            name: user.firstName + " " + user.lastName,
          });
        } else {
          res
            .status(400)
            .send({ message: "Invalid username or password", error: err });
        }
      });
    }
  });
});

app.get("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).json({ error: "logout unsuccessful" });
    }
    res.status(200).json({ message: "Success" });
  });
});
module.exports = app;
