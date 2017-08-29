const fs = require('fs');
const path = require('path');
const express = require('express');
const mustacheExpress = require('mustache-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Book = require("./models/book");

const mongoURL = 'mongodb://localhost:27017/newdb';
mongoose.connect(mongoURL, {useMongoClient: true});
mongoose.Promise = require('bluebird');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache')
app.set('layout', 'layout');

app.use('/static', express.static('static'));

// put routes here

app.get('/new/', function (req, res) {
  res.render('new_book');
});

app.post('/new/', function (req, res) {
  Book.create(req.body)
  .then(function (book) {
    res.redirect('/');
  })
  .catch(function (error) {
    let errorMsg;
    // if (error.code === DUPLICATE_RECORD_ERROR) {
    //   // make message about duplicate
    //   errorMsg = `The book name "${req.body.title}" has already been used.`
    // } else {
      errorMsg = "You have encountered an unknown error."
    // }
    res.render('new_book', {errorMsg: errorMsg});
  })
});

app.get('/:id/', function (req, res) {
  Book.findOne({_id: req.params.id}).then(function (book) {
    res.render("book", {book: book});
  })
})

app.get('/:id/new_contributor/', function (req, res) {
  Book.findOne({_id: req.params.id}).then(function (book) {
    res.render("new_contributor", {book: book});
  })
})

app.post('/:id/new_contributor/', function (req, res) {
  Book.findOne({_id: req.params.id}).then(function (book) {
    console.log(book);
    book.contributor.push(req.body);
    book.save().then(function () {
        res.render("new_contributor", {book: book});
    })
  })
})

// app.get('/:id/new_step/', function (req, res) {
//   Recipe.findOne({_id: req.params.id}).then(function (recipe) {
//     res.render("new_step", {recipe: recipe});
//   })
// })
//
// app.post('/:id/new_step/', function (req, res) {
//   Recipe.findOne({_id: req.params.id}).then(function (recipe) {
//     recipe.steps.push(req.body.step);
//     recipe.save().then(function () {
//       res.render("new_step", {recipe: recipe});
//     })
//   })
// })

app.get('/', function (req, res) {
  Book.find().then(function (book) {
    res.render('index', {book: book});
  })
})

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

module.exports = app;
