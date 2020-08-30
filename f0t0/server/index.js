const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
var indexController = require("./controllers/indexController");
var uploadController = require("./controllers/uploadController");
var timelineController = require("./controllers/timelineController");
var mongoose = require("mongoose");
var session = require("express-session");
mongoose.connect(
  "mongodb+srv://foto:foto@cluster0.5kmkd.mongodb.net/foto?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "jvkfk",
    cookie: { secure: false },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use("/", indexController);
app.use("/", uploadController);
app.use("/", timelineController);

app.get("/api/greeting", (req, res) => {
  const name = req.query.name || "World";
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
