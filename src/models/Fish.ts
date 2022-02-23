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
});

export default mongoose.model("Fish", FishSchema)