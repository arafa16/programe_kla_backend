const argon = require('argon2');
const jwt = require('jsonwebtoken');
const {user : userModel} = require('../models');
const {findUser} = require('../resources/user.resources');

class CustomError extends Error {
    constructor(message, statusCode) {
     super(message)
     this.statusCode = statusCode
    }
}

const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(404).json({
            status:404,
            success: false,
            datas:{
                message:"email or password can't be null"
            }
        });
    }

    try {
        const user = await findUser({email});
        
        if (!user) {
            const error = new CustomError("user not found", 404)
            throw error
        }

        if (user.is_active !== true) {
            // if user not active
            const error = new CustomError("user not active", 403)
            throw error
        }

        const match = await argon.verify(user.password, password);

        if(!match){
            const error = new CustomError("password not match", 401)
            throw error
        }

        const token = jwt.sign(
            {
                uuid:user.uuid,
                name:user.name,
                email:user.email,
            },
            process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
    
        req.session.token = token;
    
        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message: "login success",
            }
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status:error.statusCode || 500,
            success: false,
            datas:{
                message: error.message || "something went wrong"
            }
        });
    }
}

const registration = async(req, res) => {
    const {name, username, email, password} = req.body;

    if(!name || !username || !email || !password ){
        const error = new CustomError("value cannot be null", 404)
        throw error
    }

    try {
        const user = await findUser({email});

        if(user){
            const error = new CustomError("email already registered", 409)
            throw error
        }

        const hasPassword = await argon.hash(password);

        const response = await userModel.create({
            name,
            username,
            email,
            password: hasPassword,
        });

        return res.status(201).json({
            status:201,
            success:true,
            datas: {
                data:response,
                message: "success"
            }
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status:error.statusCode || 500,
            success: false,
            datas:{
                message: error.message || "something went wrong"
            }
        });
    }
}

const getMe = async(req, res) => {

    const user = req.user;

    try {
        const findData = await userModel.findOne({
            where:{
                uuid:user.uuid
            }
        })

        if(!findData){
            const error = new CustomError("user not found", 404)
            throw error
        }

        return res.status(201).json({
            status:200,
            success:true,
            datas: {
                data:findData,
                message: "success"
            }
        });
        
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status:error.statusCode || 500,
            success: false,
            datas:{
                message: error.message || "something went wrong"
            }
        });
    }
}

const logout = async(req, res) => {

    try {
        req.session.destroy((err)=>{
            if(err){
                const error = new CustomError("session not destroyed", 500)
                throw error
            }
    
            return res.status(200).json({
                status:200,
                success:true,
                datas: {
                    message: "logout success"
                }
            });

        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status:error.statusCode || 500,
            success: false,
            datas:{
                message: error.message || "something went wrong"
            }
        });
    }
}

module.exports = {
    login,
    registration,
    getMe,
    logout
}