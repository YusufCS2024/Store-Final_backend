const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      maxlength: 255,
      minlength: 3,
      required: true,
    },
    password: {
      type: String,
      maxlength: 255,
      minlength: 3,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

exports.User = User;
