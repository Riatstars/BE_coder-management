const mongoose = require("mongoose");
//Create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["manager", "employee"], require: true },
  },
  {
    timestamps: true,
  }
);

//Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;
