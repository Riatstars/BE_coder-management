const mongoose = require("mongoose");
//Create schema
const booSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    referenceTo: { type: mongoose.SchemaTypes.ObjectId, ref: "Foo" }, //one to one optional
  },
  {
    timestamps: true,
  }
);

const Boo = mongoose.model("Boo", booSchema);
module.exports = Boo;
