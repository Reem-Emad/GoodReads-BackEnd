const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const authorModel = require('../models/Author');
const userAdminAuthorization = require('../middlewares/Admin-User_Authentication');
const adminAuthorization = require('../middlewares/Admin_Authentication');

router.post('/add', adminAuthorization, async function (req, res, next) {

    await authorModel.create(req.body, function (err, author) {
        if (err) return next(createError(400, err.message));
        res.send(author);
    });

});

router.get('/', userAdminAuthorization, function (req, res, next) {
    authorModel.find({}).populate('bookData')
        .exec()
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createerror(500, err));
        })
});
router.get('/:authorId', userAdminAuthorization, (req, res, next) => {
    authorModel.findById(req.params.authorId).populate('bookData')
        .exec()
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createerror(500, err));
        })
})

router.patch('/:authorId', adminAuthorization, (req, res, next) => {
    authorModel.findByIdAndUpdate(req.params.authorId, req.body, { new: true }).populate('bookData')
        .exec()
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createerror(500, err));
        })
})
router.delete('/:authorId', adminAuthorization, adminAuthorization, (req, res, next) => {
    authorModel.findByIdAndDelete(req.params.authorId)
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createerror(500, err));
        })
})

module.exports = router;
