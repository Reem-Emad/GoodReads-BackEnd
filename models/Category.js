const mongoose = require('mongoose');
const bookModel = require('./Book');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    books: [{
        type: String,
        ref: bookModel,
        required: true
    }]
}, { toJSON: { virtuals: true } });
categorySchema.virtual('bookData', {
    ref: 'Book',
    localField: 'name',
    foreignField: 'category',

});
const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;