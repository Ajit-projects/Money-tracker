const Transaction = require('../models/ExpenseModel');
const { Parser } = require('json2csv');
const moment = require('moment');

exports.pie=async (req, res) => {
    const { startDate, endDate } = req.query;
  
    try {
      const transactions = await Transaction.find({
        date: {
          $gte: moment(startDate).startOf('day').toDate(),
          $lte: moment(endDate).endOf('day').toDate(),
        },
      });
  
      // Process transactions for chart data
      const categoryTotals = transactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});
  
      res.json(categoryTotals);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while generating the chart data' });
    }
  }