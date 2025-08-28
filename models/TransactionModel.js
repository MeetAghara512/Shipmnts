const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
      transaction_date: {
            type: Date,
      },
      warehouse_code: {
            type: String
      },
      products: [
            {
                  product_code: {
                        type: String,
                  },
                  qty: {
                        type: Number
                  },
                  volume: {
                        type: Number
                  },
                  location_code: {
                        type: String
                  }
            }

      ]

}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);