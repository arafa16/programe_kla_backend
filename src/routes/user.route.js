const express = require('express');
const {
    getUserTable,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');
const {verifyToken} = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/table', verifyToken, getUserTable); // Get all users
router.get('/data/:uuid', verifyToken, getUserById); // Get user by ID
router.post('/data', verifyToken, createUser); // Create a new user
router.put('/data/:uuid', verifyToken, updateUser); // Update user by ID
router.delete('/data/:uuid', verifyToken, deleteUser); // Delete user by ID

module.exports = router;
// This code defines routes for user management in an Express.js application.