//Connect to DB
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const express = require("express");
const app = express();
const crypto = require("crypto");
const Grid = require("gridfs-stream");
const Photo = require("../models/Photo");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//Create collection
const conn = mongoose.createConnection(process.env.mongoURI);
let gfs;

conn.once("open", () => {
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

//upload single image to database
app.post("/upload", upload.single("img"), (req, res, err) => {
  res.json({ file: req.file });
});

//retrieve single image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(400).json({
        err: "Not an image",
      });
    }
  });
});

//add new photo to database
app.post("/photo", (req, res) => {
  const newPhoto = new Photo({
    id: req.body.id,
    filename: req.body.filename,
    caption: req.body.caption,
    tags: req.body.tags,
    ownerName: req.body.ownerName,
    ownerID: req.body.ownerID,
  });

  newPhoto.save(function (err, photo) {
    if (err) {
      var error = "Oops something bad happened! Try again";
      return res.status(500).send(error);
    }

    return res.status(200).json(photo);
  });
});

//get all photos
app.get("/photos", (req, res) => {
  Photo.find({}, function (err, photos) {
    if (err) {
      return res.status(404).json({ err });
    }
    return res.json(photos);
  });
});

//get all photos uplaoded by a particular user
app.get("/images/:id", (req, res) => {
  Photo.find({ ownerID: req.params.id }, function (err, photos) {
    if (err) {
      return res.status(500).json({ err: "oops something bad happened!" });
    }
    return res.status(200).json({
      userImages: photos,
    });
  });
});

//delete a particular image from database
app.delete("/image/:id", (req, res) => {
  gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(500).json({ err: "oops something bad happened!" });
    }

    Photo.findOneAndDelete({ id: req.params.id }, function (err, photo) {
      if (err) {
        return res.status(500).json({ err: "oops something bad happened!" });
      }

      if (!photo) {
        return res.status(404).json({ err: "photo not found" });
      }

      return res.status(200).json({
        status: "Successfully deleted!",
        photo: photo,
        gridStore,
      });
    });
  });
});
module.exports = app;
