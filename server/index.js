const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const indexController = require("./controllers/indexController");
const uploadController = require("./controllers/uploadController");
const mongoose = require("mongoose");
const config = require("../config/keys.json");
const passport = require("passport");
mongoose.connect(config.mongoURI, { useNewUrlParser: true });
const app = express();

// Passport middleware
app.use(passport.initialize());
// Passport config
require("../config/passport")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use("/", indexController);
app.use("/", uploadController);

app.listen(config.server_port, () =>
  console.log("Express server is running on localhost:3001")
);
