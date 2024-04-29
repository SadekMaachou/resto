const mongoose = require("mongoose");

const additiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name for the additive"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter a price for the additive"],
  },
  meal: {
    type: String,
    required: [true, "Please enter a meal for the additive"],
  },
  image: {
    type: String,
    required: [true, "Please enter a photo for the additive"],
  },
});

additiveSchema.post("save", function (doc, next) {
  console.log("new additive was added", doc);
  next();
});

const Additive = mongoose.model("additive", additiveSchema);
module.exports = Additive;
