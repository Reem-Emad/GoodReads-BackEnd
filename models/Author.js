const mongoose = require('mongoose');


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
    NumberOfBooks: {
        type: Number,
        required: false
    },
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
});

const authorModel = mongoose.model('Author', authorSchema);

module.exports = authorModel;