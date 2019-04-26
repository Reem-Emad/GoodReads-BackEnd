var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const categoryModel = require('../models/Category');


//get all categories
router.get('/', function(req, res, next) {
    categoryModel.find({})
    .exec()
    .then(categories =>res.send(categories))
    .catch(err =>next(createError(500,err)));
  });

  //add category
  router.post('/add',function(req, res, next) {
    categoryModel.create(req.body)
    .then(categories =>{
      res.send(categories);
    })
    .catch(err =>{
          next(createError(400,err.message));
    });
  });

  //update category
  router.patch('/:id',(req,res,next)=>{
    user
    .findByIdAndUpdate(req.params.id,req.body,{new:true})
    .exec()
    .then(category =>res.send(category))
    .catch(err => next(createError(400,err.message)));
  });

  //delete category
  router.delete('/:id',(req,res,next)=>{
    user.findByIdAndDelete(req.params.id)
    .then(category=>res.send(category))
    .catch(err=>next((createError(400,err.message))));
  });

  //find by id
  router.get('/:id',(req,res,next)=>{
    user.findById(req.params.userId)
    .then(category=>res.send(category))
    .catch(err => next(createError(404,err.message)));
  });

  module.exports = router;