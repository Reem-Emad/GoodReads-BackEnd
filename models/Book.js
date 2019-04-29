const mongoose = require('mongoose');
const authorModel = require('../models/Author');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'book title is required'],
        unique: [true, 'book title must be unique'],

    },
    author: {
        type: String,
        ref: authorModel,
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
        type: Number,
        max: 5
    }

}, { toJSON: { virtuals: true } });

bookSchema.virtual('authorData', {
    ref: 'Author',
    localField: 'author',
    foreignField: 'FullName',

});

const bookModel = mongoose.model('Book', bookSchema);
module.exports = bookModel;