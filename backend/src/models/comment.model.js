const mongoose = require('mongoose');
const commentSchema =new  mongoose.Schema({
    text:{
        type:String,
        required:true,
        trim:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    food:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"food",
        required:true,
    }
},{timestamps:true})
const CommentModel = mongoose.model("comment",commentSchema);
module.exports = CommentModel;