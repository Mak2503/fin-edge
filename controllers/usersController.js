const UserService = require('../services/usersService');
const { AppError } = require('../middleware/errorHandler');

/**
 * USER CONTROLLER
 * Handles HTTP requests and responses for user endpoints
 * Delegates business logic to UserService
 */

class UserController {
  /**
   * POST /api/v1/users/register
   * Register a new user account
   */
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Call service to create user
      const user = await UserService.createUser({
        name,
        email,
        password
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/users/login
   * Authenticate user and return JWT token
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Call service to authenticate
      const { user, token } = await UserService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/:id
   * Retrieve user profile by ID
   * Protected route: requires valid JWT token
   */
  static async getProfile(req, res, next) {
    try {
      const userId = req.params.id;

      // Verify that user can only access their own profile
      if (req.user.id !== userId && req.user.role !== 'admin') {
        throw new AppError('You can only access your own profile', 403);
      }

      const user = await UserService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/:id
   * Update user profile
   * Protected route: requires valid JWT token
   */
  static async updateProfile(req, res, next) {
    try {
      const userId = req.params.id;
      const { name, email } = req.body;

      // Verify that user can only update their own profile
      if (req.user.id !== userId && req.user.role !== 'admin') {
        throw new AppError('You can only update your own profile', 403);
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      const user = await UserService.updateUserProfile(userId, updateData);

      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id
   * Delete user account
   * Protected route: requires valid JWT token
   */
  static async deleteAccount(req, res, next) {
    try {
      const userId = req.params.id;

      // Verify that user can only delete their own account
      if (req.user.id !== userId && req.user.role !== 'admin') {
        throw new AppError('You can only delete your own account', 403);
      }

      const result = await UserService.deleteUser(userId);

      res.status(200).json({
        success: true,
        message: 'User account deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users
   * Get all users (admin only - for testing)
   * Protected route: requires valid JWT token
   */
  static async getAllUsers(req, res, next) {
    try {
      // Verify admin role
      if (req.user.role !== 'admin') {
        throw new AppError('Only admins can access this endpoint', 403);
      }

      const users = await UserService.getAllUsers();

      res.status(200).json({
        success: true,
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;