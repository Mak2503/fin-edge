const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionsController");
const { protect } = require("../middleware/auth");
const { validate, sanitize } = require("../middleware/validator");

// Apply sanitization to all requests
router.use(sanitize);
router.use(protect);

/**
 * POST /transactions
 * Add a new transaction for the authenticated user
 * Body: transaction payload
 */
router.post("/", validate('transaction'), async (req, res) => {
  const userId = req.user.id;
  try {
    const transaction = await addTransaction(req.body, userId);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /transactions
 * Get all transactions for the authenticated user
 */
router.get("/", async (req, res) => {
  const userId = req.user.id;
  try {
    const transactions = await getTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /transactions/:id
 * Get a single transaction by transaction ID for the authenticated user
 */
router.get("/:id", async (req, res) => {
  const userId = req.user.id;
  try {
    const transaction = await getTransactionById(req.params.id, userId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /transactions/:id
 * Update a transaction by transaction ID for the authenticated user
 * Body: partial transaction payload
 */
router.patch("/:id", validate('transaction'), async (req, res) => {
  const userId = req.user.id;
  try {
    const updatedTransaction = await updateTransaction(req.params.id, req.body, userId);
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /transactions/:id
 * Delete a transaction by transaction ID for the authenticated user
 */
router.delete("/:id", async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await deleteTransaction(req.params.id, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

