const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rarity: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pond: {
    type: Number,
    required: true
  }
});

module.exports = Fish = mongoose.model("Fish", FishSchema);
