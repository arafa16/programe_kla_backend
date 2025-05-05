const express = require('express');
const {
    createMenu,
    updateMenu,
    deleteMenu,
    getAllMenu
} = require('../controllers/menu.controller');
const {verifyToken} = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/data', verifyToken, createMenu); // Create menu route
router.patch('/data/:uuid', verifyToken, updateMenu); // Update menu route
router.delete('/data/:uuid', verifyToken, deleteMenu); // Delete menu route
router.get('/data', verifyToken, getAllMenu); // Get all menu route

module.exports = router;
// This code defines routes for managing menu items in an Express.js application. It includes routes for creating, updating, deleting, and retrieving menu items, with authentication middleware applied to protect these routes.
