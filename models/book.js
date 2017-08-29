const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  publisher: {type: String},
  location: {type: String},
  year: Number,
  pages: Number,
  contributor: [{
        name: { type: String},
        role: { type: String}
  }],
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
