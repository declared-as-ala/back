const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, default: "" },
  gender: { type: String, default: "" },
  age: { type: Number, default: null },
  height: { type: Number, default: null },
  weight: { type: Number, default: null },
  birthday: { type: Date, default: null },
  profileImage: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
