const User = require("../models/User");
const Meal = require("../models/Meal");
const Additive = require("../models/Additive");
const Category = require("../models/Category");
const Plainte = require("../models/Plainte");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
const nodemailer = require("nodemailer");

//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { username: "", password: "", email: "" };
  //incorrect username
  if (err.message === "incorrect username") {
    errors.username = "this username is not registered";
  }

  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "incorrect password";
  }

  //duplicate error code
  if (err.code === 11000) {
    errors.username = "that username is already registered";
    errors.email = "that phone number is already registered";
    return errors;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "RestaurantMenu", { expiresIn: maxAge });
};

//Controllers
module.exports.signUp_get = (req, res) => {};

module.exports.signUp_post = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = await User.create({ username, password, email });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user, token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_get = (req, res) => {};

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    if (user.level == "boss") {
      res.redirect("/boss");
    } else if (user.level == "chef") {
      res.redirect("/chef");
    }
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1, httpOnly: true });
  res.redirect("/");
};

module.exports.forgotPassword_post = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("user not found");
  }
  const resetCode = randomString.generate({ length: 6, charset: "numeric" });
  user.resetCode = resetCode;
  await user.save();
  res.send(resetCode);
  /*const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "restaurantmenu@gmail.com",
      pass: "app password",
    },
  });

  const mailOptions = {
    from: "restaurantmenu@gmail.com",
    to: user.email,
    subject: "Reset Your Password",
    text: `votre code est: ${resetCode}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("email envoye avec succes");
    }
  });
  */
};

module.exports.resetPassword_post = async (req, res) => {
  const { code, email, newPass } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("utilisateur non trouve");
  }
  if (code !== user.resetCode) {
    return res.status(400).send("le code est incorrect");
  }

  user.password = newPass;
  user.resetCode = null;
  await user.save();
  res.status(200).send("reintialisation avec succes");
};
// Cart -----------------------------
//Level
module.exports.updateAmountAndLevel_put = async (req, res) => {
  const { name, newAmount } = req.body;
  const user = await User.findOne({ name });
  try {
    if (user) {
      user.amount += Number(newAmount);
      if (amount >= 3500) {
        user.level = "Diamond";
      } else if (amount >= 2500) {
        user.level = "Platinum";
      } else if (amount >= 1700) {
        user.level = "Gold";
      } else if (amount >= 1000) {
        user.level = "Silver";
      } else if (amount >= 400) {
        user.level = "Bronze";
      }
      await user.save();
    } else {
      res.status(200).json({ message: "user not found!" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
//---------------------------------
//API
//Categories
module.exports.getCategory_get = async (req, res) => {
  const { group } = req.body;
  try {
    const category = await Category.find({ group });
    res.status(200).json({ category: category });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
//Meals
module.exports.getMealsByCategory_get = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findOne({ name });
    if (category) {
      const meals = await Meal.find({ category: name });
      res.status(200).json({ meals: meals });
    } else {
      res.status(400).json({ message: "category not found!" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
//Additives
module.exports.getAdditive_get = async (req, res) => {
  const { meal } = req.body;
  try {
    const additive = await Additive.find({ meal });
    res.status(200).json({ additive: additive });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
//---------------------------------
//Boss
//Se plainder
module.exports.addPlainte_post = async (req, res) => {
  const { text } = req.body;
  try {
    const plainte = await Plainte.create({ text });
    res.status(200).json({ plainte });
  } catch (err) {
    res.status(400).json({ err });
  }
};
module.exports.getPlainte_get = async (req, res) => {
  const plaintes = await Plainte.find();
  res.status(200).json({ plaintes });
};
// Meals
module.exports.addMeal_post = async (req, res) => {
  const { name, price, category, image, description, ingredients } = req.body;
  try {
    const meal = await Meal.create({
      name,
      price,
      category,
      image,
      description,
      ingredients,
    });
    res.status(201).json({ meal: meal });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports.deleteMeal_delete = async (req, res) => {
  const { name } = req.body;
  try {
    const meal = await Meal.findOne({ name });
    if (meal) {
      const deletedMeal = await Meal.findOneAndDelete({ _id: meal._id });
      res.status(200).json({ message: "meal has been deleted successfully" });
    } else {
      res.status(400).json({ error: "meal not found!" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateMeal_put = async (req, res) => {
  const { typeOfModification, newValue, name } = req.body;
  try {
    const meal = await Meal.findOne({ name });
    if (meal) {
      if (typeOfModification == "name") {
        meal.name = newValue;
      } else if (typeOfModification == "price") {
        meal.price = Number(newValue);
      } else if (typeOfModification == "category") {
        meal.category = newValue;
      } else if (typeOfModification == "image") {
        meal.image = newValue;
      } else if (typeOfModification == "description") {
        meal.description = newValue;
      } else if (typeOfModification == "ingredients") {
        meal.ingredients = newValue;
      }
      await meal.save();
      res.status(200).json({ meal: meal });
    } else {
      res.status(400).json({ message: "meal not found!" });
    }
  } catch (err) {
    console.log(err);
  }
};
//--------------------------
//Additives
module.exports.addAdditive_post = async (req, res) => {
  const { name, price, meal, image } = req.body;
  try {
    const additive = await Additive.create({
      name,
      price,
      meal,
      image,
    });
    res.status(201).json({ additive: additive });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports.deleteAdditive_delete = async (req, res) => {
  const { name } = req.body;
  try {
    const additive = await Additive.findOne({ name });
    if (additive) {
      const deletedAdditive = await Additive.findOneAndDelete({
        _id: additive._id,
      });
      res
        .status(200)
        .json({ message: "Additive has been deleted successfully" });
    } else {
      res.status(400).json({ error: "Additive not found!" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateAdditive_put = async (req, res) => {
  const { typeOfModification, newValue, name } = req.body;
  try {
    const additive = await Additive.findOne({ name });
    if (additive) {
      if (typeOfModification == "name") {
        additive.name = newValue;
      } else if (typeOfModification == "price") {
        additive.price = Number(newValue);
      } else if (typeOfModification == "meal") {
        additive.meal = newValue;
      } else if (typeOfModification == "image") {
        additive.image = newValue;
      }
      await additive.save();
      res.status(200).json({ additive: additive });
    } else {
      res.status(400).json({ message: "Additive not found!" });
    }
  } catch (err) {
    console.log(err);
  }
};

//----------------------------
//Category
module.exports.addCategory_post = async (req, res) => {
  const { name, group, image } = req.body;
  try {
    const category = await Category.create({
      name,
      group,
      image,
    });
    res.status(201).json({ category: category });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports.deleteCategory_delete = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findOne({ name });
    if (category) {
      const deletedCategory = await Category.findOneAndDelete({
        _id: Category._id,
      });
      res
        .status(200)
        .json({ message: "Category has been deleted successfully" });
    } else {
      res.status(400).json({ error: "Category not found!" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateCategory_put = async (req, res) => {
  const { typeOfModification, newValue, name } = req.body;
  try {
    const category = await Category.findOne({ name });
    if (category) {
      if (typeOfModification == "name") {
        category.name = newValue;
      } else if (typeOfModification == "image") {
        category.image = newValue;
      }
      await category.save();
      res.status(200).json({ category: category });
    } else {
      res.status(400).json({ message: "Category not found!" });
    }
  } catch (err) {
    console.log(err);
  }
};
