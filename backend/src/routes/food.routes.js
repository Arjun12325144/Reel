const express = require('express');
const foodController = require('../controller/food.controller')
const authMiddleware = require('../middleware/auth.middleware')
const router = express.Router();
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
})


router.post("/",authMiddleware.authFoodPartnerMiddleware, upload.single("video") ,foodController.createFood)

// get /api/food protected ya user ka liye ha jb scroll krege to user ka liye videos layaga
router.get("/",authMiddleware.authUserMiddleware,foodController.getFoodItems)


router.post("/like",authMiddleware.authUserMiddleware,foodController.likeFood)

router.post("/save",authMiddleware.authUserMiddleware,foodController.saveFood)

// Add this new route to fetch saved videos
router.get("/saved", authMiddleware.authUserMiddleware, foodController.getSaveFood);
router.post("/comment",authMiddleware.authUserMiddleware,foodController.createComment)
router.get("/comment/:id",authMiddleware.authUserMiddleware,foodController.getComments)

module.exports = router;