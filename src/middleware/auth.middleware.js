const jwt = require('jsonwebtoken');
const {user : userModel} = require('../models');

const verifyToken = async(req, res, next) => {

    const token = req.session.token;

    try {
        jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=>{
            if(err){
                return res.status(401).send({
                    status:401,
                    success: false,
                    datas:{
                        message:"access expired, please login again",
                        data:err.expiredAt
                    }
                   
                });
            }
    
            const user = await userModel.findOne({
                where:{
                    uuid:decoded.uuid
                }
            })
    
            if(!user){
                return res.status(404).json({
                    status:404,
                    success: false,
                    datas:{
                        message:"login failed, user not found or deleted"
                    }
                })
            }
        
            if(user.is_active !== true){
                return res.status(401).json({
                    status:401,
                    success: false,
                    datas:{
                        message: `you don't have access, user is not active`,
                    }
                })
            }
    
            req.user = user;
    
            next()
        });
    } catch (error) {
        return res.status(500).json({
            status:500,
            success: false,
            data:{
                message:"internal server error",
                error:error.message
            }
        })
        
    }
    
}

module.exports = {
    verifyToken
}