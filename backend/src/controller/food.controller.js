const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model')
const saveModel = require('../models/save.model')
const commentModel = require('../models/comment.model');
// const { v4: uuid } = require("uuid")
let uuidv4;
import('uuid').then(uuid => {
    uuidv4 = uuid.v4;
});
//cloud storage tumari file store krage or jb tumari marzi hogi tb tume dhikha dege
//hm imagekit ka use kr rhe jo hamari video ho cloud ki thara rakhaga 
//or jb hma jarurat hogi vo hma ek url dega
async function createFood(req,res){
    console.log(req.foodPartner);
    console.log(req.body);
    console.log(req.file);
    // jo ya uuid ha ya hma random id generate krke degi 
    const fileUploadResult = await storageService.uploadFile(req.file.buffer,uuidv4());
    // console.log(fileUploadResult )
    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video : fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })
    // res.send("food item sreated");
    res.status(201).json({message: "food created successfully", food:foodItem})
}

async function getFoodItems(req,res){
    const foodItems = await foodModel.find({});
    res.status(200).json({messsage:"food items fetched successfully",foodItems})
}


async function likeFood(req,res){
    const {foodId} = req.body;
    const user  = req.user;
    const isAlredayLiked = await likeModel.findOne({
        user:user._id,
        food: foodId
    })
    if(isAlredayLiked){
        await likeModel.deleteOne({
            user:user._id,
            food:foodId
        })
        await foodModel.findByIdAndUpdate(foodId,{
            $inc: {likeCount: -1}
        })
        return res.status(200).json({message:"food unliked successfully"})
    }
    const like = await likeModel.create({
        user:user._id,
        food: foodId
    })
    await foodModel.findByIdAndUpdate(foodId,{
        $inc: {likeCount:1}
    })
    res.status(201).json({
        message:"Food liked successfully",
        like
    })
}

async function saveFood(req,res){
    const {foodId} = req.body;
    const user = req.user;
    
    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food:foodId
    })
    if(isAlreadySaved){
        await saveModel.deleteOne({
            user: user._id,
            food:foodId
        })
        await foodModel.findByIdAndUpdate(foodId,{
            $inc: {savesCount: -1}
        })
        return res.status(200).json({message:"food unsaved successfully"});
    }
    const save = await saveModel.create({
        user: user._id,
        food:foodId
    })

    await foodModel.findByIdAndUpdate(foodId,{
        $inc: {savesCount: 1}
    })

    res.status(201).json({
        message :"food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedItems: savedFoods.map(item => item.food)
    });

}

async function createComment(req,res){
    const {foodId, text} = req.body;
    const user = req.user;
    if(!text || text.trim()===""){
        return res.status(400).json({message:"Comment cannot be empty"})
    }
    const comment = await commentModel.create({
        text,
        user:user._id,
        food:foodId
    })
    await foodModel.findByIdAndUpdate(foodId,{
        $inc:{commentCount:1}
    })
    res.status(200).json({message:"comment added successfully",comment})
}

async function getComments(req,res){
    const  {id: foodId} = req.params; // Correctly get 'id' from params and rename to foodId
    try{
        const comments = await commentModel.find({food:foodId}).populate('user','fullName').sort({createdAt:-1});
        res.status(200).json({message:"comments retrieved successfully", comments: comments})
    }catch(err){
        res.status(500).json({message:"Internal server error"})
    }

}









module.exports  = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood,
    createComment,
    getComments

}