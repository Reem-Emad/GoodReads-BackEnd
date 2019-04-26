var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const booksModel = require('../models/Book');

const userAdminAuthorization = require('../middlewares/Admin-User_Authentication');
const adminAuthorization = require('../middlewares/Admin_Authentication');

//get all books
router.get('/', userAdminAuthorization, async function (req, res, next) {
    booksModel.find({}).populate('authorData')
        .exec()
        .then(books => { res.send(books); })
        .catch(err => { next(createError(404, err.message)); })
});
//add new book
router.post('/add', adminAuthorization, async function (req, res, next) {
    await booksModel.create(req.body, function (err) {
        if (err) return next(createError(400, err.message));
        res.send('done');
    });
});

//search for books
router.post('/search', userAdminAuthorization, async function (req, res, next) {

    booksModel.find({}).populate('authorData')
        .exec()
        .then(books => {
            res.send(books.filter(book => {
                if (book.title.toLowerCase().includes(req.body.name.toLowerCase()))
                    return book
            }))
        })
        .catch(err => { next(createError(404, err.message)); })
})
//get book by id
router.get('/:id', userAdminAuthorization, async function (req, res, next) {
    const id = req.params.id;

    booksModel.findById(id).populate('authorData')
        .exec()
        .then(book => { res.send(book); })
        .catch(err => { next(createError(404, err.message)); })

});
//update book
router.patch('/:id', adminAuthorization, async function (req, res) {
    const id = req.params.id;
    await booksModel.findByIdAndUpdate(id, req.body, { new: true }).populate('authorData')
        .exec()
        .then(book => { res.send(book); })
        .catch(err => { next(createError(404, err.message)); })
})
//delete book
router.delete('/:id', adminAuthorization, async function (req, res) {
    const id = req.params.id;
    await booksModel.findByIdAndDelete(id, (err, result) => {
        if (err) return next(createError(404, err.message));
        res.send(result);
    })
})


module.exports = router;