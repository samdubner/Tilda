const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  roleId: {
    type: String,
    required: true,
  },
});

module.exports = Role = mongoose.model("Role", RoleSchema);
