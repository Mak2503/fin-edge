const Joi = require('joi');
const { AppError } = require('./errorHandler');

// 1. Define Strict Rules (Whitelist Approach)
const schemas = {
  userRegistration: Joi.object({
    name: Joi.string().alphanum().min(2).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$%^&+=]{8,30}$')).required()
  }),
  userLogin: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
  }),
  userUpdateProfile: Joi.object({
    name: Joi.string().alphanum().min(2).max(30),
    email: Joi.string().email().lowercase()
  }).min(1),
  transaction: Joi.object({
    type: Joi.string().valid('income', 'expense').required(),
    amount: Joi.number().positive().precision(2).required(),
    category: Joi.string().max(20).required(),
    date: Joi.date().iso().max('now').default(Date.now)
  })
};

// 2. The Validation Engine (Logic Protection)
const validate = (schemaName) => (req, res, next) => {
  const { error, value } = schemas[schemaName].validate(req.body, { 
    abortEarly: false, 
    stripUnknown: true // Removes any field not in our whitelist
  });

  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    return next(new AppError(message, 400));
  }
  req.body = value; 
  next();
};

// 3. Recursive Deep Sanitation (NoSQL, SQL & Script Injection)
const sanitize = (req, res, next) => {
  const clean = (data) => {
    if (typeof data !== 'object' || data === null) {
      if (typeof data === 'string') {
        return data
          .replace(/[$\\]/g, '') // Remove NoSQL/SQL escape chars
          .replace(/<[^>]*>?/gm, '') // Strip HTML tags (XSS)
          .trim();
      }
      return data;
    }
    // Recursively clean objects/arrays
    Object.keys(data).forEach(key => {
      if (key.startsWith('$')) delete data[key];
      else data[key] = clean(data[key]);
    });
    return data;
  };

  req.body = clean(req.body || {});
  req.query = clean(req.query || {});
  req.params = clean(req.params || {});
  next();
};

module.exports = { validate, sanitize };