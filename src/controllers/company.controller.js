const {
 company:companyModel,
} = require('../models');

class CustomError extends Error {
    constructor(message, statusCode) {
     super(message)
     this.statusCode = statusCode
    }
}

const createCompany = async (req, res) => {
    const {name, address, phone, email} = req.body;

    try {
        if (!name || !address || !phone || !email) {
            const error = new CustomError("name, address, phone, email can't be null", 404)
            throw error
        }

        const company = await companyModel.create({
            name,
            address,
            phone,
            email
        });

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"company created",
                data:company
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

const getCompanyByUuid = async (req, res) => {
    const {uuid} = req.params;

    try {
        if (!uuid) {
            const error = new CustomError("uuid can't be null", 404)
            throw error
        }

        const company = await companyModel.findOne({
            where:{
                uuid
            }
        });

        if(!company){
            const error = new CustomError("company not found", 404)
            throw error
        }

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"company found",
                data:company
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

const updateCompany = async (req, res) => {
    const {name, address, phone, email} = req.body;
    const {uuid} = req.params;

    try {
        if (!uuid) {
            const error = new CustomError("uuid can't be null", 404)
            throw error
        }

        const company = await companyModel.findOne({
            where:{
                uuid
            }
        });

        if(!company){
            const error = new CustomError("company not found", 404)
            throw error
        }

        await company.update({
            name,
            address,
            phone,
            email
        });

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"company updated",
                data:company
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

const deleteCompany = async (req, res) => {
    const {uuid} = req.params;

    try {
        if (!uuid) {
            const error = new CustomError("uuid can't be null", 404)
            throw error
        }

        const company = await companyModel.findOne({
            where:{
                uuid
            }
        });

        if(!company){
            const error = new CustomError("company not found", 404)
            throw error
        }

        await company.destroy();

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"company deleted",
                data:company
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

const getCompanyFirst = async (req, res) => {
    try {
        const company = await companyModel.findOne({
            order: [['createdAt', 'DESC']]
        });

        if(!company){
            const error = new CustomError("company not found", 404)
            throw error
        }

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"company found",
                data:company
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

const getAllCompany = async (req, res) => {
    try {
        const companies = await companyModel.findAll();

        if(!companies){
            const error = new CustomError("company not found", 404)
            throw error
        }

        return res.status(200).json({
            status:200,
            success: true,
            datas:{
                message:"company found",
                data:companies
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
    createCompany,
    getCompanyByUuid,
    updateCompany,
    deleteCompany,
    getCompanyFirst,
    getAllCompany
}