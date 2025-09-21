const express = require('express');
const router = express.Router();
const foodPartnerController = require('../controller/food-partner.controller')
const authMiddleware = require('../middleware/auth.middleware')

// get /api/food-partner/:id
router.get("/:id",authMiddleware.authUserMiddleware, foodPartnerController.getFoodPartnerById)


module.exports = router;