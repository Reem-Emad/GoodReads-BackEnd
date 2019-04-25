const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

const verifyToken = util.promisify(jwt.verify);
const saltRounds = 10;
const secretKey = process.env.JWT_Secret || 'secretkeysecretkey';

const adminSchema = new mongoose.Schema({
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
    }
}, {
        toJSON: {
            transform: true
        }
    });

const hashPassword = (password) => {
    return bcrypt.hash(password, saltRounds);
}
adminSchema.pre('save', async function () {
    const currentAdmin = this;
    if (currentAdmin.isNew) {
        currentAdmin.password = await hashPassword(currentAdmin.password);
    }
});
adminSchema.pre('findOneAndUpdate', async function () {
    const currentAdmin = this;
    const updates = currentAdmin._update
    const { password } = updates;
    if (password) {
        currentAdmin._update.password = await hashPassword(password);
    }

});
adminSchema.method('verifyPassword', function (password) {
    const currentAdmin = this;
    return bcrypt.compare(password, currentAdmin.password)
});
adminSchema.method('generateToken', function () {
    const currentAdmin = this;
    const token = jwt.sign(currentAdmin.id, secretKey);
    return token;
})
adminSchema.static('verifyToken', async function (token) {
    const decoded = await verifyToken(token, secretKey);
    return this.findById(decoded);
});

adminSchema.options.toJSON.transform = (doc, ret, options) => {
    delete ret.password;
    return ret;
}
const adminModel = mongoose.model('User', adminSchema);

module.exports = adminModel;