const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: [{type:String}],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    username: { type: String, ref: 'User', required: true }, 
    createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
