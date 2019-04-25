const mongoose = require('mongoose');
const authorModel = require('../models/Author');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'book title is required']
    },
    author: {
        type: String,
        required: [true, 'book author is required']
    },
    category: {
        type: String,
        required: [true, 'book category is required']
    },
    numOfPages: {
        type: Number
    },
    description: {
        type: String,
        required: [true, 'book description is required']
    },
    cover: {
        type: String
    },
    avgRate: {
        type: Number
    }

}, { toJSON: { virtuals: true } });

bookSchema.virtual('authorData', {
    ref: authorModel,
    localField: 'author',
    foreignField: 'FullName',

});

const bookModel = mongoose.model('Book', bookSchema);
module.exports = bookModel;