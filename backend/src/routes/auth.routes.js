const express  = require('express');
const authController = require('../controller/auth.controller');
const router = express.Router();

// user auth api's
router.post("/user/register",authController.registerUser)
router.post("/user/login",authController.loginUser)
router.get("/user/logout",authController.logoutUser)


//foood partner auth api's
router.post("/food-partner/register",authController.registerFoodPartner)
router.post("/food-partner/login",authController.loginFoodPartner)
router.get("/food-partner/logout",authController.logoutFoodPartner)





module.exports = router;