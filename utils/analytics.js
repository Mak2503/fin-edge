/**
 * Financial Analytics and Insights Utility
 * Provides methods for analyzing transactions and generating financial insights
 */

/**
 * Get monthly expense summary for a user
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Monthly expense summary grouped by month and year
 */
const getMonthlySummary = (transactions) => {
  try {
    const summary = {};

    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!summary[monthKey]) {
          summary[monthKey] = {
            month: monthKey,
            totalExpenses: 0,
            transactionCount: 0,
            categoryBreakdown: {}
          };
        }

        summary[monthKey].totalExpenses += transaction.amount;
        summary[monthKey].transactionCount += 1;

        // Add category breakdown
        if (!summary[monthKey].categoryBreakdown[transaction.category]) {
          summary[monthKey].categoryBreakdown[transaction.category] = 0;
        }
        summary[monthKey].categoryBreakdown[transaction.category] += transaction.amount;
      }
    });

    return Object.values(summary).sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    throw new Error(`Error calculating monthly summary: ${error.message}`);
  }
};

/**
 * Analyze income vs expense for a given period
 * @param {Array} transactions - Array of transaction objects
 * @param {Date} startDate - Start date for analysis (optional)
 * @param {Date} endDate - End date for analysis (optional)
 * @returns {Object} Income vs expense analysis with metrics
 */
const getIncomeVsExpenseAnalysis = (transactions, startDate = null, endDate = null) => {
  try {
    let filteredTransactions = transactions;

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filteredTransactions = transactions.filter((transaction) => {
        const txDate = new Date(transaction.date);
        return txDate >= start && txDate <= end;
      });
    }

    let totalIncome = 0;
    let totalExpense = 0;
    const incomeBreakdown = {};
    const expenseBreakdown = {};

    filteredTransactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
        if (!incomeBreakdown[transaction.category]) {
          incomeBreakdown[transaction.category] = 0;
        }
        incomeBreakdown[transaction.category] += transaction.amount;
      } else if (transaction.type === 'expense') {
        totalExpense += transaction.amount;
        if (!expenseBreakdown[transaction.category]) {
          expenseBreakdown[transaction.category] = 0;
        }
        expenseBreakdown[transaction.category] += transaction.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(2) : 0;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate: parseFloat(savingsRate),
      incomeBreakdown,
      expenseBreakdown,
      transactionCount: filteredTransactions.length,
      period: {
        startDate: startDate || 'all-time',
        endDate: endDate || 'all-time'
      }
    };
  } catch (error) {
    throw new Error(`Error calculating income vs expense: ${error.message}`);
  }
};

/**
 * Get category-wise spending breakdown
 * @param {Array} transactions - Array of transaction objects
 * @param {String} type - Transaction type ('income' or 'expense')
 * @returns {Object} Category-wise breakdown with amounts and percentages
 */
const getCategoryBreakdown = (transactions, type = 'expense') => {
  try {
    const categoryData = {};
    let totalAmount = 0;

    // Filter transactions by type and calculate totals
    const filteredTransactions = transactions.filter((tx) => tx.type === type);

    filteredTransactions.forEach((transaction) => {
      const category = transaction.category || 'Uncategorized';

      if (!categoryData[category]) {
        categoryData[category] = {
          category,
          amount: 0,
          count: 0,
          percentage: 0
        };
      }

      categoryData[category].amount += transaction.amount;
      categoryData[category].count += 1;
      totalAmount += transaction.amount;
    });

    // Calculate percentages
    const breakdown = Object.values(categoryData).map((cat) => ({
      ...cat,
      percentage: totalAmount > 0 ? parseFloat(((cat.amount / totalAmount) * 100).toFixed(2)) : 0
    }));

    // Sort by amount descending
    breakdown.sort((a, b) => b.amount - a.amount);

    return {
      type,
      totalAmount,
      totalTransactions: filteredTransactions.length,
      categories: breakdown
    };
  } catch (error) {
    throw new Error(`Error calculating category breakdown: ${error.message}`);
  }
};

/**
 * Get top spending categories
 * @param {Array} transactions - Array of transaction objects
 * @param {Number} limit - Number of top categories to return (default: 5)
 * @returns {Array} Top spending categories
 */
const getTopSpendingCategories = (transactions, limit = 5) => {
  try {
    const breakdown = getCategoryBreakdown(transactions, 'expense');
    return breakdown.categories.slice(0, limit);
  } catch (error) {
    throw new Error(`Error calculating top spending categories: ${error.message}`);
  }
};

/**
 * Get average transaction amount by category
 * @param {Array} transactions - Array of transaction objects
 * @param {String} type - Transaction type ('income' or 'expense')
 * @returns {Object} Average amounts by category
 */
const getAverageByCategory = (transactions, type = 'expense') => {
  try {
    const categoryData = {};

    const filteredTransactions = transactions.filter((tx) => tx.type === type);

    filteredTransactions.forEach((transaction) => {
      const category = transaction.category || 'Uncategorized';

      if (!categoryData[category]) {
        categoryData[category] = {
          category,
          totalAmount: 0,
          count: 0,
          average: 0
        };
      }

      categoryData[category].totalAmount += transaction.amount;
      categoryData[category].count += 1;
    });

    // Calculate averages
    Object.keys(categoryData).forEach((category) => {
      categoryData[category].average = parseFloat(
        (categoryData[category].totalAmount / categoryData[category].count).toFixed(2)
      );
    });

    return Object.values(categoryData).sort((a, b) => b.average - a.average);
  } catch (error) {
    throw new Error(`Error calculating average by category: ${error.message}`);
  }
};

/**
 * Get spending trend over time (monthly comparison)
 * @param {Array} transactions - Array of transaction objects
 * @param {Number} months - Number of months to analyze (default: 12)
 * @returns {Array} Monthly spending trend data
 */
const getSpendingTrend = (transactions, months = 12) => {
  try {
    const today = new Date();
    const trend = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      let monthlyExpense = 0;
      let monthlyIncome = 0;

      transactions.forEach((transaction) => {
        const txDate = new Date(transaction.date);
        if (txDate >= monthStart && txDate <= monthEnd) {
          if (transaction.type === 'expense') {
            monthlyExpense += transaction.amount;
          } else if (transaction.type === 'income') {
            monthlyIncome += transaction.amount;
          }
        }
      });

      trend.push({
        month: monthKey,
        income: monthlyIncome,
        expense: monthlyExpense,
        net: monthlyIncome - monthlyExpense
      });
    }

    return trend;
  } catch (error) {
    throw new Error(`Error calculating spending trend: ${error.message}`);
  }
};

module.exports = {
  getMonthlySummary,
  getIncomeVsExpenseAnalysis,
  getCategoryBreakdown,
  getTopSpendingCategories,
  getAverageByCategory,
  getSpendingTrend
};
