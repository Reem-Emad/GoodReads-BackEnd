var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const userModel = require('../models/User');
const bookModel = require('../models/Book');
const authMiddleware = require('../middlewares/User_Authentication');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:|\./g, '') + '.' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); //save it
  }
  else {
    cb(null, false); //don't save
  }
}
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

router.post('/register', upload.single('image'), async function (req, res, next) {
  // console.log(req.body)
  // // console.log(req.file)
  // // debugger;
  // const newUser = new userModel({
  //   name: { fname: req.body.fname, lname: req.body.lname },
  //   email: req.body.email,
  //   password: req.body.password,
  //   image: req.file.path
  // })

  // newUser.save()
  //   .then(user => res.send(user))
  //   .catch(err => next(createError(400, err.message)))
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


  const found = req.user.books.find(function (book) {

    if (book.bookId.toString() === bookId) {
      if (book.status !== status)
        book.status = status;

      return book;
    }
  })
  if (found === undefined)
    req.user.books.push({ bookId: bookId, rate: 0, status: status });

  userModel.findByIdAndUpdate(req.user._id, { books: req.user.books }, { new: true }, (err, result) => {
    if (err) next(createError(404, err.message));
    res.send(result);
  })
})

module.exports = router;

