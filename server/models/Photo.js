const mongoose = require("mongoose");

const PhotoSchema = mongoose.Schema({
  id: { type: String, required: true },
  length: { type: Number, required: false },
  chunkSize: { type: Number, required: true },
  uploadDate: { type: String, required: true },
  filename: { type: String, required: true },
  md5: { type: String, required: true },
  contentType: { type: String, required: true },
  caption: { type: String, required: false },
  tags: { type: [String], required: false },
});

const Photo = mongoose.model("photos", PhotoSchema);
module.exports = Photo;
