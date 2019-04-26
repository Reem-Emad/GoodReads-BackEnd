const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const authorModel = require('../models/Author');
const authMiddleware = require('../middlewares/User_Authentication');

router.post('/add', async function (req, res, next) {
    await authorModel.create(req.body, function (err, author) {
        if (err) return next(createError(400, err.message));
        res.send(author);
    });
});
// router.use(authMiddleware);
router.get('/', function (req, res, next) {
    authorModel.find({})
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createerror(500, err));
        })
});
router.get('/:authorId', (req, res, next) => {
    authorModel.findById(req.params.authorId)
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createerror(500, err));
        })
})
router.patch('/:authorId', (req, res, next) => {
    authorModel.findByIdAndUpdate(req.params.authorId, req.body, { new: true })
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createerror(500, err));
        })
})
router.delete('/:authorId', (req, res, next) => {
    authorModel.findByIdAndDelete(req.params.authorId)
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createerror(500, err));
        })
})

module.exports = router;
