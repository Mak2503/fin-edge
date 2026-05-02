const transactionsModel = require('../models/transactionsModel');
const analytics = require('../utils/analytics');

const getMonthlySummary = async (userId) => {
  const transactions = await transactionsModel.find({ userId });
  return analytics.getMonthlySummary(transactions);
};

const getIncomeVsExpense = async (userId, startDate = null, endDate = null) => {
  const transactions = await transactionsModel.find({ userId });
  return analytics.getIncomeVsExpenseAnalysis(transactions, startDate, endDate);
};

const getCategoryBreakdown = async (userId, type = 'expense') => {
  if (!['income', 'expense'].includes(type)) {
    const error = new Error("Type must be 'income' or 'expense'");
    error.statusCode = 400;
    throw error;
  }

  const transactions = await transactionsModel.find({ userId });
  return analytics.getCategoryBreakdown(transactions, type);
};

const getTopSpending = async (userId, limit = 5) => {
  const transactions = await transactionsModel.find({ userId });
  return analytics.getTopSpendingCategories(transactions, Number(limit) || 5);
};

const getAverageByCategory = async (userId, type = 'expense') => {
  if (!['income', 'expense'].includes(type)) {
    const error = new Error("Type must be 'income' or 'expense'");
    error.statusCode = 400;
    throw error;
  }

  const transactions = await transactionsModel.find({ userId });
  return analytics.getAverageByCategory(transactions, type);
};

const getSpendingTrend = async (userId, months = 12) => {
  const transactions = await transactionsModel.find({ userId });
  return analytics.getSpendingTrend(transactions, Number(months) || 12);
};

const getDashboard = async (userId) => {
  const transactions = await transactionsModel.find({ userId });

  return {
    incomeVsExpense: analytics.getIncomeVsExpenseAnalysis(transactions),
    monthlySummary: analytics.getMonthlySummary(transactions),
    expenseBreakdown: analytics.getCategoryBreakdown(transactions, 'expense'),
    incomeBreakdown: analytics.getCategoryBreakdown(transactions, 'income'),
    topSpending: analytics.getTopSpendingCategories(transactions, 5),
    spendingTrend: analytics.getSpendingTrend(transactions, 6)
  };
};

module.exports = {
  getMonthlySummary,
  getIncomeVsExpense,
  getCategoryBreakdown,
  getTopSpending,
  getAverageByCategory,
  getSpendingTrend,
  getDashboard
};