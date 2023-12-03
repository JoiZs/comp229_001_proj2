const { Schema, default: mongoose } = require("mongoose");

// 5 Datatypes
const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const userModel = mongoose.model("User", User);

module.exports = userModel;
