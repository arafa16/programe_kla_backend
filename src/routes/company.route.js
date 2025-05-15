const express = require('express');
const {
    createCompany,
    getCompanyByUuid,
    updateCompany,
    deleteCompany,
    getCompanyFirst,
    getAllCompany
} = require('../controllers/company.controller');
const {verifyToken} = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/data', verifyToken, createCompany); // Create company route
router.get('/data/:uuid', verifyToken, getCompanyByUuid); // Get company by UUID route
router.patch('/data/:uuid', verifyToken, updateCompany); // Update company route
router.delete('/data/:uuid', verifyToken, deleteCompany); // Delete company route
router.get('/first', verifyToken, getCompanyFirst); // Get the first company route
router.get('/data', verifyToken, getAllCompany); // Get all company route    

module.exports = router;
// This code defines routes for managing menu items in an Express.js application. It includes routes for creating, updating, deleting, and retrieving menu items, with authentication middleware applied to protect these routes.
