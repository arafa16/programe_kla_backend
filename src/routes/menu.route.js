const express = require('express');
const {
    createMenu,
    updateMenu,
    deleteMenu,
    getAllMenu,
    getMenuByUuid,
    getMenuTable
} = require('../controllers/menu.controller');
const {verifyToken} = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/data', verifyToken, createMenu); // Create menu route
router.patch('/data/:uuid', verifyToken, updateMenu); // Update menu route
router.delete('/data/:uuid', verifyToken, deleteMenu); // Delete menu route
router.get('/data', getAllMenu); // Get all menu route
router.get('/data/:uuid', verifyToken, getMenuByUuid); // Get menu by UUID route
router.get('/table', verifyToken, getMenuTable); // Get menu table route

module.exports = router;