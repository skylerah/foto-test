const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user) {
      return res
        .status(400)
        .json({ message: "Account with that email already exists!" });
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
              res.status(500).send({ message: error });
            } else {
              User.findOne({ email: newUser.email }, function (
                err,
                updatedUser
              ) {
                const payload = {
                  id: updatedUser._id,
                  name: updatedUser.firstName + " " + updatedUser.lastName,
                  email: updatedUser.email,
                };
                jwt.sign(
                  payload,
                  process.env.secretOrKey,
                  {
                    expiresIn: "24h",
                  },
                  (err, token) => {
                    res.json({
                      success: true,
                      token: "Bearer " + token,
                    });
                  }
                );
              });
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
      return res
        .status(400)
        .json({ message: "Account with that email doesnt exist!" });
    } else {
      bcrypt.compare(req.body.password, user.password, function (
        err,
        response
      ) {
        if (response) {
          const payload = {
            id: user._id,
            name: user.firstName + " " + user.lastName,
            email: user.email,
          };
          jwt.sign(
            payload,
            process.env.secretOrKey,
            {
              expiresIn: "24h",
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ message: "Invalid username or password!", error: err });
        }
      });
    }
  });
});
module.exports = app;
