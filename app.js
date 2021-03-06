const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const authorRouter = require('./routes/author');
const booksRouter = require('./routes/books');
const categoriesRouter = require('./routes/categories');


const createError = require('http-errors');
const cors = require('cors');
require('./db');


const app = express();

app.use(cors());

app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/admins', adminRouter);
app.use('/api/authors', authorRouter);
app.use('/api/books', booksRouter);
app.use('/api/categories', categoriesRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    res.status(err.status || 500);
    res.send(err);
    // render the error page
    // res.render('error');

});

module.exports = app;
