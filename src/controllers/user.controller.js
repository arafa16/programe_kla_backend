const {
    user:userModel,
} = require('../models');
const {Op} = require('sequelize');
const argon = require('argon2');

class CustomError extends Error {
    constructor(message, statusCode) {
     super(message)
     this.statusCode = statusCode
    }
}

const getUserTable = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = Number(page - 1) * limit;
        const search = req.query.search || '';
        
        const findData = await userModel.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ]
            },
            limit: limit,
            offset: offset
        });

        if(!findData){
            const error = new CustomError("user not found", 404)
            throw error
        }
        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"user found",
                data:findData
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

const getUserById = async (req, res) => {
    const {uuid} = req.params;

    try {
        const user = await userModel.findOne({
            where: {
                uuid: uuid
            }
        });

        if (!user) {
            const error = new CustomError("user not found", 404)
            throw error
        }

        return res.status(200).json({
            status: 200,
            success: true,
            datas: {
                data: user
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

const createUser = async (req, res) => {
    const {name, username, email, password, is_active} = req.body;

    try {
        const findData = await userModel.findOne({
            where: {
                email: email,
                is_active: true
            }
        });

        if (findData) {
            const error = new CustomError("user already exist", 409)
            throw error
        }

        const hasPassword = await argon.hash(password);

        const response = await userModel.create({
            name: name,
            username: username,
            email: email,
            password: hasPassword,
            is_active
        });

        return res.status(201).json({
            status: 201,
            success: true,
            datas: {
                data: response,
                message: "success"
            }
        });
    }
    catch (error) {
        return res.status(error.statusCode || 500).json({
            status:error.statusCode || 500,
            success: false,
            datas:{
                message: error.message || "something went wrong"
            }
        });
    }
}

const updateUser = async (req, res) => {
    const {uuid} = req.params;
    const {name, username, email, password, is_active} = req.body;

    try {
        const findData = await userModel.findOne({
            where: {
                uuid: uuid
            }
        });

        if (!findData) {
            const error = new CustomError("user not found", 404)
            throw error
        }

        const hasPassword = await argon.hash(password);

        const response = await userModel.update({
            name: name,
            username: username,
            email: email,
            password: hasPassword,
            is_active: is_active
        }, {
            where: {
                uuid: uuid
            }
        });

        return res.status(200).json({
            status: 200,
            success: true,
            datas: {
                data: response,
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

const deleteUser = async (req, res) => {
    const {uuid} = req.params;

    try {
        const findData = await userModel.findOne({
            where: {
                uuid: uuid
            }
        });

        if (!findData) {
            const error = new CustomError("user not found", 404)
            throw error
        }

        const response = await findData.destroy();

        if (!response) {
            const error = new CustomError("user not found", 404)
            throw error
        }

        return res.status(200).json({
            status: 200,
            success: true,
            datas: {
                data: response,
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

module.exports = {
    getUserTable,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}




