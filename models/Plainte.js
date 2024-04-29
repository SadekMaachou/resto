const mongoose = require("mongoose");

const plainteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please enter a text for the plainte"],
    unique: true,
  },
});

plainteSchema.post("save", function (doc, next) {
  console.log("new plainte was added", doc);
  next();
});

const Plainte = mongoose.model("plainte", plainteSchema);
module.exports = Plainte;
