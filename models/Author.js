const mongoose = require('mongoose');
const bookModel = require('./Book');

const authorSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: [true, 'name required'],
        unique: true
    },
    Image: {
        type: String,
        default: 'N/A'
    },
    Books: [{
        type: String,
        ref: bookModel,
        required: true
    }],
    NumberOfFriends: {
        type: Number,
        required: false
    },
    Born: {
        type: String,
        required: false
    },
    Website: {
        type: String,
    },
    Genre: {
        type: String,
    },
    Influences: {
        type: String,
    },
    MemberSince: {
        type: Date,
    },
    Description: {
        type: String,
    }
}, { toJSON: { virtuals: true } });
authorSchema.virtual('bookData', {
    ref: 'Book',
    localField: 'FullName',
    foreignField: 'author',

});

const authorModel = mongoose.model('Author', authorSchema);

module.exports = authorModel;