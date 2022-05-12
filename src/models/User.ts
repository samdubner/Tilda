const mongoose = require("mongoose");
const Schema = mongoose.Schema;

import Role from "./Role";
import Fish from "./Fish";

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
  notifyStatus: {
    type: Boolean,
  },
});

export default mongoose.model("User", UserSchema);
