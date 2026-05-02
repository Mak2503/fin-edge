const transactionsModel = require('../models/transactionsModel');

const formatTransaction = (transaction) => {
  const plainTransaction = transaction.toObject ? transaction.toObject() : transaction;
  return {
    ...plainTransaction,
    date: new Date(parseInt(plainTransaction.date)).toISOString() // Convert Unix timestamp to ISO string
  };
};

const formatTransactions = (transactions = []) => transactions.map(formatTransaction);

const addTransaction = async (transaction, userId) => {
  try {
    const result = await transactionsModel.create({ ...transaction, userId });
    return formatTransaction(result);
  } catch (error) {
    throw error;
  }
}

const getTransactions = async (userId) => {
  try {
    const transactions = await transactionsModel.find({ userId });
    return formatTransactions(transactions);
  } catch (error) {
    throw error;
  }
}

const getTransactionById = async (transactionId, userId) => {
  try {
    const transaction = await transactionsModel.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.userId !== userId) {
      throw new Error("Access denied: Transaction does not belong to the user");
    }
    return formatTransaction(transaction);
  } catch (error) {
    throw error;
  }
}

const updateTransaction = async (transactionId, updatedData, userId) => {
  try {
    const transaction = await transactionsModel.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.userId !== userId) {
      throw new Error("Access denied: Transaction does not belong to the user");
    }
    const updatedTransaction = await transactionsModel.findByIdAndUpdate(transactionId, updatedData, { new: true });
    return formatTransaction(updatedTransaction);
  } catch (error) {
    throw error;
  }
}

const deleteTransaction = async (transactionId, userId) => {
  try {
    const transaction = await transactionsModel.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.userId !== userId) {
      throw new Error("Access denied: Transaction does not belong to the user");
    }
    await transactionsModel.findByIdAndDelete(transactionId);
    return { message: 'Transaction deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
}