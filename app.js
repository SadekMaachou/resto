const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const dotenv = require("dotenv");

dotenv.config();
// const pug = require("pug");
//
const app = express();
//Middleware
app.use(express.json());
app.set("view engine", "pug");
app.use(cookieParser());
//server listening
app.listen(3000, () => {
  console.log("Server is listening...");
  console.log(process.env.MONGODB_CONNECT_URI);
});
//database connection
mongoose
  .connect(process.env.MONGODB_CONNECT_URI)
  .then(() => {
    console.log("Connected successfully...");
  })
  .catch((err) => {
    console.log("there is a problem:\n", err);
  });

// routes
// check the current client if its logged in on all get routes
//app.get("*", checkUser);
// frontend home page
app.get("/", (req, res) => res.render("home"));
// just logged users have the access to this
app.get("/access", requireAuth, (req, res) => res.render("access"));

app.use(authRoutes);
