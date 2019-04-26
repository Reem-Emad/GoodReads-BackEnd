var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const userModel = require('../models/User');
const bookModel = require('../models/Book');
const authMiddleware = require('../middlewares/User_Authentication');

router.post('/register', async function (req, res, next) {
  debugger;
  await userModel.create(req.body, function (err, user) {
    if (err) return next(createError(400, err.message));
    res.send(user);
  });
});

router.post('/login', async function (req, res, next) {
  
  const { email, password } = req.body;
  const currentUser = await userModel.findOne({ email });
  if (!currentUser)
    return next(createError(401));

  const passwordMatch = await currentUser.verifyPassword(password);
  if (!passwordMatch)
    return next(createError(401));
  const token = currentUser.generateToken();
  res.send({
    profile: currentUser,
    token
  })
});

router.use(authMiddleware);

router.get('/profile', function (req, res, next) {
  userModel.findById(req.user._id).populate('books.bookId')
    .exec()
    .then(docs => { res.send(docs) })
    .catch(err => { next(createError(404, err.message)) })
})
router.get('/books/all', function (req, res, next) {
  userModel.findById(req.user._id).populate('books.bookId')
    .exec()
    .then(docs => { res.send(docs.books) })
    .catch(err => { next(createError(404, err.message)) })
})

router.get('/books/read', function (req, res, next) {
  userModel.findById(req.user._id).populate('books.bookId')
    .exec()
    .then(docs => {
      res.send(docs.books.filter(book => {
        if (book.status === 'read')
          return book;
      }))
    })
    .catch(err => { next(createError(404, err.message)) })

})

router.get('/books/wanttoread', function (req, res, next) {
  userModel.findById(req.user._id).populate('books.bookId')
    .exec()
    .then(docs => {
      res.send(docs.books.filter(book => {
        if (book.status === 'want to read')
          return book;
      }))
    })
    .catch(err => { next(createError(404, err.message)) })

})

router.get('/books/currentlyreading', function (req, res, next) {
  userModel.findById(req.user._id).populate('books.bookId')
    .exec()
    .then(docs => {
      res.send(docs.books.filter(book => {
        if (book.status === 'currently reading')
          return book;
      }))
    })
    .catch(err => { next(createError(404, err.message)) })

})

router.post('/book/edit/:id', function (req, res, next) {

  bookId = req.params.id;
  updated = req.body;
  const { status, rate } = updated;

  if (status) {
    req.user.books.find(book => {
      const id = book.bookId.toString();
      if (id === bookId)
        book["status"] = status;
    })
  }
  if (rate) {
    req.user.books.find(book => {
      const id = book.bookId.toString();
      if (id === bookId)
        book["rate"] = rate;
    })
  }

  userModel.findByIdAndUpdate(req.user._id, { books: req.user.books }, { new: true }, (err, result) => {
    if (err) next(createError(404, err.message));
    res.send(result);
  })
})

router.post('/book/add', function (req, res, next) {
  newBook = req.body;
  const { bookId, status } = newBook;
  req.user.books.push({ bookId: bookId, rate: 0, status: status });
  userModel.findByIdAndUpdate(req.user._id, { books: req.user.books }, { new: true }, (err, result) => {
    if (err) next(createError(404, err.message));
    res.send(result);
  })
})

module.exports = router;

