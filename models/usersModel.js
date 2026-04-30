const mongoose = require('mongoose');
const Joi = require('joi');

// --- MONGODB SCHEMA (for database operations) ---
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [30, 'Name cannot exceed 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false // Don't return password by default
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model('User', userSchema);

// --- VALIDATION SCHEMAS (for request validation) ---
const userValidationSchemas = {
  register: Joi.object({
    name: Joi.string().alphanum().min(2).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$%^&+=]{8,30}$')).required()
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().alphanum().min(2).max(30),
    email: Joi.string().email().lowercase()
  }).min(1) // At least one field must be updated
};

module.exports = {
  User,
  userValidationSchemas
};