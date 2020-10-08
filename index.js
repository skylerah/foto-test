const express = require("express");
const bodyParser = require("body-parser");
const indexController = require("./controllers/indexController");
const uploadController = require("./controllers/uploadController");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const app = express();
const port = process.env.PORT || 3002;
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true });

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", indexController);
app.use("/", uploadController);

//serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(port, () =>
  console.log("Express server is running on port " + port)
);
