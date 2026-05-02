const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sanitize } = require('../middleware/validator');
const {
  getMonthlySummary,
  getIncomeVsExpense,
  getCategoryBreakdown,
  getTopSpending,
  getAverageByCategory,
  getSpendingTrend,
  getDashboard
} = require('../controllers/analyticsController');

router.use(sanitize);
router.use(protect);

/**
 * GET /analytics/monthly-summary
 * Get monthly expense summary for the authenticated user
 */
router.get('/monthly-summary', async (req, res) => {
  try {
    const userId = req.user.id;
    const summary = await getMonthlySummary(userId);

    res.status(200).json({
      success: true,
      data: summary,
      message: 'Monthly summary retrieved successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /analytics/income-vs-expense
 * Get income vs expense analysis
 * Query params: startDate (optional), endDate (optional)
 */
router.get('/income-vs-expense', async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const analysis = await getIncomeVsExpense(userId, startDate || null, endDate || null);

    res.status(200).json({
      success: true,
      data: analysis,
      message: 'Income vs expense analysis retrieved successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /analytics/category-breakdown
 * Get category-wise spending breakdown
 * Query params: type ('income' or 'expense', default: 'expense')
 */
router.get('/category-breakdown', async (req, res) => {
  try {
    const userId = req.user.id;
    const { type = 'expense' } = req.query;
    const breakdown = await getCategoryBreakdown(userId, type);

    res.status(200).json({
      success: true,
      data: breakdown,
      message: 'Category breakdown retrieved successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /analytics/top-spending
 * Get top spending categories
 * Query params: limit (default: 5)
 */
router.get('/top-spending', async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;
    const topCategories = await getTopSpending(userId, limit);

    res.status(200).json({
      success: true,
      data: topCategories,
      message: 'Top spending categories retrieved successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /analytics/average-by-category
 * Get average transaction amount by category
 * Query params: type ('income' or 'expense', default: 'expense')
 */
router.get('/average-by-category', async (req, res) => {
  try {
    const userId = req.user.id;
    const { type = 'expense' } = req.query;
    const averages = await getAverageByCategory(userId, type);

    res.status(200).json({
      success: true,
      data: averages,
      message: 'Average by category retrieved successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /analytics/spending-trend
 * Get spending trend over time (monthly comparison)
 * Query params: months (default: 12)
 */
router.get('/spending-trend', async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 12 } = req.query;
    const trend = await getSpendingTrend(userId, months);

    res.status(200).json({
      success: true,
      data: trend,
      message: 'Spending trend retrieved successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /analytics/dashboard
 * Get comprehensive dashboard data combining multiple analytics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardData = await getDashboard(userId);

    res.status(200).json({
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
