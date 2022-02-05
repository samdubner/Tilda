const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require("./Role");
const Fish = require("./Fish");

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  streak: {
    type: Number,
  },
  dailyDone: {
    type: Boolean,
  },
  inMainGuild: {
    type: Boolean,
  },
  begDate: {
    type: Number,
  },
  role: {
    type: Role.schema,
  },
  items: {
    type: [Schema.Types.ObjectId],
    ref: "Item",
  },
  fish: {
    type: [Fish.schema],
  },
  caughtFish: {
    type: [String],
  },
  categoryId: {
    type: String,
  },
  baitUsed: {
    type: Number,
  },
});

module.exports = User = mongoose.model("User", UserSchema);
