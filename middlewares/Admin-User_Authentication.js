const createError = require('http-errors');
const userModel = require('../models/User');
const adminModel = require('../models/Admin');

module.exports = async (req, res, next) => {

    try {
        if (!req.headers.authorization) return next(createError(401));
        const [, token] = req.headers.authorization.split(' ');
        const user = await userModel.verifyToken(token);
        const admin = await adminModel.verifyToken(token);
        if (!user && !admin)
            return next(createError(401));
        else if (user && !admin) {
            req.user = user;
            next();
        }
        else {
            req.admin = admin;
            next();
        }
    } catch (err) {
        next(createError(401, err.message));
    }
};