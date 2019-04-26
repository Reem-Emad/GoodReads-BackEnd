var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const categoryModel = require('../models/Category');


const userAdminAuthorization = require('../middlewares/Admin-User_Authentication');
const adminAuthorization = require('../middlewares/Admin_Authentication');


//get all categories
router.get('/', userAdminAuthorization, function (req, res, next) {
  categoryModel.find({}).populate('bookData')
    .exec()
    .then(categories => res.send(categories))
    .catch(err => next(createError(500, err)));
});

//add category
router.post('/add', adminAuthorization, function (req, res, next) {
  categoryModel.create(req.body)
    .then(categories => {
      res.send(categories);
    })
    .catch(err => {
      next(createError(400, err.message));
    });
});

//update category
router.patch('/:id', adminAuthorization, (req, res, next) => {
  categoryModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('bookData')
    .exec()
    .then(category => res.send(category))
    .catch(err => next(createError(400, err.message)));
});

//delete category
router.delete('/:id', adminAuthorization, (req, res, next) => {
  categoryModel.findByIdAndDelete(req.params.id)
    .then(category => res.send(category))
    .catch(err => next((createError(400, err.message))));
});

//find by id
router.get('/:id', userAdminAuthorization, (req, res, next) => {
  categoryModel.findById(req.params.userId).populate('bookData')
    .exec()
    .then(category => res.send(category))
    .catch(err => next(createError(404, err.message)));
});

module.exports = router;
