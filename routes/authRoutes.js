const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.get("/signUp", authController.signUp_get);
router.post("/signUp", authController.signUp_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.post("/forgotPassword", authController.forgotPassword_post);
router.post("/resetPassword", authController.resetPassword_post);
//level
router.put("/updateLevel", authController.updateAmountAndLevel_put);
//API Meals
router.get("/meals", authController.getMealsByCategory_get);
router.get("/category", authController.getCategory_get);
router.get("/additive", authController.getAdditive_get);
//Boss------------------
//Se plainder
router.get("/plaintes", authController.getPlainte_get);
router.post("/addPlainte", authController.addPlainte_post);
// meals
router.post("/addMeal", authController.addMeal_post);
router.delete("/deleteMeal", authController.deleteMeal_delete);
router.put("/updateMeal", authController.updateMeal_put);
//additives
router.post("/addAdditive", authController.addAdditive_post);
router.delete("/deleteAdditive", authController.deleteAdditive_delete);
router.put("/updateAdditive", authController.updateAdditive_put);
// category
router.post("/addCategory", authController.addCategory_post);
router.delete("/deleteCategory", authController.deleteCategory_delete);
router.put("/updateCategory", authController.updateCategory_put);
module.exports = router;
