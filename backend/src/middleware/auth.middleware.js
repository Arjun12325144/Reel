const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require('../models/user.models')
const jwt = require('jsonwebtoken');


async function authFoodPartnerMiddleware(req,res,next){
    const token = req.cookies.token; 

    // sbse phala token dekho ha ya nhi user register ya login bhi ha
    if(!token){
       return res.status(401).json({message:"Please login first"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)


        //agar ha token to dekho token kuch bakar to nhi verify kro
        // is decoded ka andar se hma foodpartner ki id mil jayagi
        //  agar token shi hoga phir hm uski detail nukal lege
        //kyuki hm jb token create kr rhe the to hmna foodpartner ki id pass ki thi
        const foodPartner = await foodPartnerModel.findById(decoded.id);

        // request me hm new property use kr rhe ha foodpartner ke nam se
        req.foodPartner = foodPartner
        next();

    }catch(err){
        return res.status(401).json({message:"Invalid token"})
    }
}

async function authUserMiddleware(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Please login first"});
    }

    try{
        const decodec = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodec.id);
        req.user = user;
        next();

    }catch(err){
        return res.status(401).json({message:"Invalid token"});
    }

}
module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
}