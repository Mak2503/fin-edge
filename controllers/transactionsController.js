const transactionsModel = require('../models/transactionsModel');

const addTransaction = async (transaction) => {
  try {
    const result = await transactionsModel.create(transaction);
    return result;
  } catch (error) {
    throw error;
  }
}

const getTransactions = async (userId) => {
  try {
    const transactions = await transactionsModel.find({ userId });
    return transactions;
  } catch (error) {
    throw error;
  }
}

const getTransactionById = async (transactionId) => {
  try {
    const transaction = await transactionsModel.findById(transactionId);
    return transaction;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addTransaction,
  getTransactions
}