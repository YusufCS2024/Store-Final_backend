const { User } = require("../models/User");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://admin:admin@store.lyvpbhb.mongodb.net/?retryWrites=true&w=majority", {
    family: 4,
  })
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.error("MongoDB Connection Failed..", err));

async function seed() {
  try {
    let user = new User({
      email: "admin",
      password: await bcrypt.hash("admin", 10),
    });
    await user.save();
  } catch (error) {
    console.log(error);
  }
}

seed();
