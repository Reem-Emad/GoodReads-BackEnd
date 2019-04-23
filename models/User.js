const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

const bookModel = require('./Book');

const verifyToken = util.promisify(jwt.verify);
const saltRounds = 10;
const secretKey = process.env.JWT_Secret || 'secretkeysecretkey';

const userSchema = new mongoose.Schema({
    name: {
        fname: {
            type: String,
            required: [true, 'first name required'],
        },
        lname: {
            type: String,
            required: [true, 'last name required'],
        }
    },

    email: {
        type: String,
        validate: function (email) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(email);
        },
        index: { unique: true },
        unique: [true, 'email must be unique'],
        required: [true, 'email required'],
    },
    password: {
        type: String,
        required: [true, 'password required'],
        hidden: true
    },
    image: {
        type: String,
        default: 'N/A'
    },
    books: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: bookModel },
        rate: { type: Number, default: 0 },
        status: { type: String, lowercase: true, enum: ['want to read', 'read', 'currently reading'] }
    }]


}, {
        toJSON: {
            transform: true
        }
    });

const hashPassword = (password) => {
    return bcrypt.hash(password, saltRounds);
}
userSchema.pre('save', async function () {
    const currentUser = this;
    if (currentUser.isNew) {
        currentUser.password = await hashPassword(currentUser.password);
    }
});
userSchema.pre('findOneAndUpdate', async function () {
    const currentUser = this;
    const updates = currentUser._update
    const { password } = updates;
    if (password) {
        currentUser._update.password = await hashPassword(password);
    }

});
userSchema.method('verifyPassword', function (password) {
    const currentUser = this;
    return bcrypt.compare(password, currentUser.password)
});
userSchema.method('generateToken', function () {
    const currentUser = this;
    const token = jwt.sign(currentUser.id, secretKey);
    return token;
})
userSchema.static('verifyToken', async function (token) {
    const decoded = await verifyToken(token, secretKey);
    return this.findById(decoded);
});

userSchema.options.toJSON.transform = (doc, ret, options) => {
    delete ret.password;
    return ret;
}
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;