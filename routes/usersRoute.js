const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usersController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

/**
 * USER ROUTES
 * All endpoints for user management
 * 
 * Public Routes (no authentication required):
 *   - POST /api/v1/users/register - Create new user
 *   - POST /api/v1/users/login - User login
 * 
 * Protected Routes (authentication required):
 *   - GET /api/v1/users/:id - Get user profile
 *   - PUT /api/v1/users/:id - Update user profile
 *   - DELETE /api/v1/users/:id - Delete user account
 *   - GET /api/v1/users - Get all users (admin only)
 */

// --- PUBLIC ROUTES (no authentication required) ---

/**
 * Register new user
 * POST /api/v1/users/register
 * Body: { name, email, password }
 */
router.post('/register', validate('userRegistration'), UserController.register);

/**
 * Login user
 * POST /api/v1/users/login
 * Body: { email, password }
 */
router.post('/login', validate('userLogin'), UserController.login);

// --- PROTECTED ROUTES (authentication required) ---

/**
 * Get all users (admin only)
 * GET /api/v1/users
 * Headers: { Authorization: "Bearer <token>" }
 */
router.get('/', protect, UserController.getAllUsers);

/**
 * Get user profile
 * GET /api/v1/users/:id
 * Headers: { Authorization: "Bearer <token>" }
 */
router.get('/:id', protect, UserController.getProfile);

/**
 * Update user profile
 * PUT /api/v1/users/:id
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { name?, email? }
 */
router.put('/:id', protect, validate('userUpdateProfile'), UserController.updateProfile);

/**
 * Delete user account
 * DELETE /api/v1/users/:id
 * Headers: { Authorization: "Bearer <token>" }
 */
router.delete('/:id', protect, UserController.deleteAccount);

module.exports = router;