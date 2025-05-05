const express = require('express');
const {
    login, 
    registration, 
    getMe,
    logout
} = require('../controllers/auth.controller');
const {verifyToken} = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/login', login); // Login route
router.post('/register', registration); // Registration route
router.get('/me', verifyToken, getMe); // Get user info route
router.delete('/logout', logout); // Logout route

module.exports = router;
// This code defines a route for user authentication in an Express.js application.