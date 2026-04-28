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

// router.use(protect)

// Apply sanitization to all requests
router.use(sanitize);

// Add a new transaction
router.post("/", validate('transaction'), async (req, res) => {
  // For testing without auth, we use a hardcoded userId. In production, this should come from the authenticated user context (e.g., req.user.id).
  const userId = req.user?.id || "testUserId"; 
  try {
    const transaction = await addTransaction(req.body, userId);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all transactions for a user
router.get("/", async (req, res) => {
  const userId = req.user?.id || "testUserId";
  try {
    const transactions = await getTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a transaction by ID
router.get("/:id", async (req, res) => {
  const userId = req.user?.id || "testUserId";
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

// Update a transaction
router.patch("/:id", validate('transaction'), async (req, res) => {
  const userId = req.user?.id || "testUserId";
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

// Delete a transaction
router.delete("/:id", async (req, res) => {
  const userId = req.user?.id || "testUserId";
  try {
    const result = await deleteTransaction(req.params.id, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

