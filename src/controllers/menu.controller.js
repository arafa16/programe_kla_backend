const {
    menu:menuModel,
} = require('../models');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const {Op} = require('sequelize');

class CustomError extends Error {
    constructor(message, statusCode) {
     super(message)
     this.statusCode = statusCode
    }
}

const getAllMenu = async (req, res) => {
    try {
        const menu = await menuModel.findAll({
            order:[
                ['created_at', 'DESC']
            ]
        });

        if(!menu){
            const error = new CustomError("menu not found", 404)
            throw error
        }

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"menu found",
                data:menu
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

const getMenuTable = async (req, res) => {

    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = Number(page - 1) * limit;
        const search = req.query.search || '';

        const menu = await menuModel.findAndCountAll({
            order:[
                ['created_at', 'DESC']
            ],
            where:{
                name:{
                    [Op.like]: `%${search}%`
                }
            },
            limit,
            offset,
        });

        if(!menu){
            const error = new CustomError("menu not found", 404)
            throw error
        }
        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"menu found",
                data:menu
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

const createMenu = async (req, res) => {
    const {name, link, description, is_active} = req.body;

    try {
        if (!name || !link || !description) {
            const error = new CustomError("name, link, description can't be null", 404)
            throw error
        }

        if(!req.files) {
            const error = new CustomError("No file Upload", 404)
            throw error
        }
    
        const {logo} = req.files;
    
        if(!logo) {
            const error = new CustomError("No file Upload", 404)
            throw error
        }

        const file = req.files.logo;
        const ext = path.extname(file.name);
        const logo_file_name = crypto.randomUUID()+ext;
        const logo_file_link = `/assets/logo/${logo_file_name}`;
        const allowed_type = ['.png','.jpg','.jpeg'];

        //filter file type
        if(!allowed_type.includes(ext.toLowerCase())){
            const error = new CustomError("type file not allowed", 401)
            throw error
        }

        file.mv(`./public/assets/logo/${logo_file_name}`, async(err)=>{
            if(err){
                return res.status(500).json({
                    status:500,
                    success: false,
                    datas:{
                        message:"internal server error",
                        error:err.message
                    }
                });
            }
        });

        const menu = await menuModel.create({
            name,
            logo_name:file.name,
            logo_file_name,
            logo_file_link,
            link,
            description,
            is_active
        });

        return res.status(201).json({
            status:201,
            success: true,
            datas:{
                message:"menu created",
                data:menu
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

const updateMenu = async (req, res) => {
    const {name, link, description, is_active} = req.body;
    const {uuid} = req.params;

    try {
        if (!name || !link || !description) {
            const error = new CustomError("name, link, description can't be null", 404)
            throw error
        }

        const findData = await menuModel.findOne({
            where:{
                uuid
            }
        });

        if(!findData){
            const error = new CustomError("menu not found", 404)
            throw error
        }

        if(!req.files) {
            const updateData = await menuModel.update({
                name,
                link,
                description,
                is_active
            },{
                where:{
                    uuid
                }
            });

            if(!updateData){
                const error = new CustomError("menu not updated", 404)
                throw error
            }

            return res.status(201).json({
                status:201,
                success: true,
                datas:{
                    message:"menu updated",
                    data:updateData
                }
            });
        }

        const file = req.files.logo;
        const ext = path.extname(file.name);
        const logo_file_name = crypto.randomUUID()+ext;
        const logo_file_link = `/assets/logo/${logo_file_name}`;
        const allowed_type = ['.png','.jpg','.jpeg'];

        //filter file type
        if(!allowed_type.includes(ext.toLowerCase())){
            const error = new CustomError("type file not allowed", 401)
            throw error
        }

        file.mv(`./public/assets/logo/${logo_file_name}`, async(err)=>{
            if(err){
                return res.status(500).json({
                    status:500,
                    success: false,
                    datas:{
                        message:"internal server error",
                        error:err.message
                    }
                });
            }

            //delete old file
            const oldFile = `./public${findData.logo_file_link}`;
            fs.unlink(oldFile, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                //file removed
            });
        });

        const updateData = await menuModel.update({
            name,
            logo_name:file.name,
            logo_file_name,
            logo_file_link,
            link,
            description
        },{
            where:{
                uuid
            }
        });

        if(!updateData){
            const error = new CustomError("menu not updated", 404)
            throw error
        }

        return res.status(201).json({
            status:201,
            success: true,
            datas:{
                message:"menu updated",
                data:updateData
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

const deleteMenu = async (req, res) => {
    const {uuid} = req.params;

    try {
        const findData = await menuModel.findOne({
            where:{
                uuid
            }
        });

        if(!findData){
            const error = new CustomError("menu not found", 404)
            throw error
        }

        //delete old file
        const oldFile = `./public${findData.logo_file_link}`;
        fs.unlink(oldFile, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            //file removed
        });

        const deleteData = await menuModel.destroy({
            where:{
                uuid
            }
        });

        if(!deleteData){
            const error = new CustomError("menu not deleted", 404)
            throw error
        }

        return res.status(201).json({
            status:201,
            success: true,
            datas:{
                message:"menu deleted",
                data:deleteData
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

const getMenuByUuid = async (req, res) => {
    const {uuid} = req.params;

    try {
        if (!uuid) {
            const error = new CustomError("uuid can't be null", 404)
            throw error
        }

        const menu = await menuModel.findOne({
            where:{
                uuid
            }
        });

        if(!menu){
            const error = new CustomError("menu not found", 404)
            throw error
        }

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"menu found",
                data:menu
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
    getAllMenu,
    createMenu,
    updateMenu,
    deleteMenu,
    getMenuByUuid,
    getMenuTable
}