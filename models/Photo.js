const mongoose = require("mongoose");

const PhotoSchema = mongoose.Schema({
  id: { type: String, required: true },
  filename: { type: String, required: true },
  caption: { type: String, required: false },
  tags: { type: [String], required: false },
  ownerName: { type: String, required: true },
  ownerID: { type: String, required: true },
});

const Photo = mongoose.model("photos", PhotoSchema);
module.exports = Photo;
