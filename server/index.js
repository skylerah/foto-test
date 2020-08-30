const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const indexController = require("./controllers/indexController");
const uploadController = require("./controllers/uploadController");
const timelineController = require("./controllers/timelineController");
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("../config.json");
mongoose.connect(config.mongoURI, { useNewUrlParser: true });
const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: config.app_secret_hash_key,
    cookie: { secure: false },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use("/", indexController);
app.use("/", uploadController);
app.use("/", timelineController);

app.listen(config.server_port, () =>
  console.log("Express server is running on localhost:3001")
);
