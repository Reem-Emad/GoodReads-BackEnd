const createError = require('http-errors');
const userModel = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return next(createError(401));
        const [, token] = req.headers.authorization.split(' ');
        const user = await userModel.verifyToken(token);
        if (!user) return next(createError(401));
        req.user = user;
        next();
    } catch (err) {
        next(createError(401, err.message));
    }
};