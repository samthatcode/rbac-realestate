const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    type: Array,
    required: true,
    default: [],
  },
  description: { 
    type: String,
    required: true, 
  },
});

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
