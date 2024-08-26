const mongoose = require('mongoose');

const bookExchangeSchema = new mongoose.Schema({
    bookIdAskedFor: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    bookIdSent: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    fromUsername: { type: String, required: true },
    toUsername: { type: String, required: true },  
    createdAt: { type: Date, default: Date.now }
});
const BookExchange = mongoose.model('BookExchange', bookExchangeSchema);
module.exports = BookExchange;
