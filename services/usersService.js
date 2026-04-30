const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/usersModel');
const { AppError } = require('../middleware/errorHandler');

/**
 * USER SERVICE
 * Contains all business logic for user operations
 * Handles: password hashing, JWT creation, user CRUD operations
 */

class UserService {
  /**
   * Create a new user account
   * @param {Object} userData - { name, email, password }
   * @returns {Object} - Created user object (without password)
   */
  static async createUser(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return this.formatUserResponse(user);
  }

  /**
   * Authenticate user and generate JWT token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} - { user, token }
   */
  static async loginUser(email, password) {
    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = this.generateToken(user._id);

    return {
      user: this.formatUserResponse(user),
      token
    };
  }

  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Object} - User object
   */
  static async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - { name, email }
   * @returns {Object} - Updated user object
   */
  static async updateUserProfile(userId, updateData) {
    const { name, email } = updateData;

    // Build update object with only provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    // Check if new email already exists (if email is being updated)
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new AppError('Email already in use', 400);
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.formatUserResponse(user);
  }

  /**
   * Delete user account
   * @param {string} userId - User ID
   * @returns {Object} - Success message
   */
  static async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      success: true,
      message: 'User account deleted successfully'
    };
  }

  /**
   * Get all users (admin only - for testing)
   * @returns {Array} - Array of all users
   */
  static async getAllUsers() {
    return await User.find();
  }

  /**
   * Generate JWT token
   * @param {string} userId - User ID
   * @returns {string} - JWT token
   */
  static generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
  }

  /**
   * Format user response (remove sensitive data)
   * @param {Object} user - Mongoose user document
   * @returns {Object} - Formatted user object
   */
  static formatUserResponse(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

module.exports = UserService;