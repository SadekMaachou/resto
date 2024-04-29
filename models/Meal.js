const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name for the meal"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter a price for the meal"],
  },
  category: {
    type: String,
    required: [true, "Please enter a category for the meal"],
  },
  image: {
    type: String,
    required: [true, "Please enter a photo for the meal"],
  },
  description: {
    type: String,
  },
  ingredients: {
    type: String,
  },
});

mealSchema.post("save", function (doc, next) {
  console.log("new meal was added", doc);
  next();
});

const Meal = mongoose.model("meal", mealSchema);
module.exports = Meal;
