// utils/saveTransaction.js
const Transaction = require('../models/ExpenseModel');

const saveTransaction = async (transaction) => {
  const newTransaction = new Transaction(transaction);
  await newTransaction.save();
};

module.exports = saveTransaction;
