const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { sanitize, validate } = require('./middleware/validator');
const { protect } = require('./middleware/auth');

const app = express();

// --- GLOBAL MIDDLEWARE ---
app.use(helmet());          // Adds security headers
app.use(cors());            // Allows frontend to connect
app.use(compression());     // Compress all responses to improve performance
app.use(express.json({ limit: '10kb' }));    // Moved up to ensure body is parsed before sanitation
app.use(sanitize);          // Global deep sanitisation to clean all inputs
app.use(logger);            // Keeping existing logger

// --- ROUTES ---
app.get('/', (req, res) => {
  res.json({ success: true, message: "FinEdge API is Live" });
});

// --- ERROR HANDLING ---
// This MUST be the very last app.use()
app.use(errorHandler);

module.exports = app;