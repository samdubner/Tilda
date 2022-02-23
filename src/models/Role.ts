const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  roleId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Role", RoleSchema)