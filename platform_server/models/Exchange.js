const mongoose = require('mongoose');

const bookExchangeSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const BookExchange = mongoose.model('BookExchange', bookExchangeSchema);
module.exports = BookExchange;
