const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      maxLength: 255,
      required: true,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    phone_number: {
      type: String,
      maxLength: 10,
      unique: true,
    },
    email: {
      type: String,
      maxLength: 255,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
