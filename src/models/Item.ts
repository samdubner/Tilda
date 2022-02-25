const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Item", ItemSchema)
