const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.post("/signup", (req, res) => {
  const body = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };
  if (!validateSignUpBody(body)) {
    var error = "All fields are required for sign up!";
    return res.status(400).send({ message: error });
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user) {
      return res
        .status(401)
        .json({ message: "Account with that email already exists!" });
    } else {
      const newUser = new User(body);
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          // Store hash in your password DB.
          newUser.password = hash;
          newUser.save(function (err, addedUser) {
            if (err) {
              var error = "Oops something bad happened. Try again!";
              res.status(500).send({ message: error });
            } else {
              const payload = {
                id: addedUser._id,
                name: addedUser.firstName + " " + addedUser.lastName,
                email: addedUser.email,
              };
              jwt.sign(
                payload,
                process.env.secretOrKey,
                {
                  expiresIn: "5h",
                },
                (err, token) => {
                  res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                  });
                }
              );
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
        .status(404)
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
              expiresIn: "5h",
            },
            (err, token) => {
              res.status(200).json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res
            .status(401)
            .json({ message: "Invalid username or password!" });
        }
      });
    }
  });
});

const validateSignUpBody = (obj) => {
  return (
    obj.firstName.length > 0 &&
    obj.lastName.length > 0 &&
    obj.email.length > 0 &&
    obj.password.length > 0
  );
};
module.exports = app;
