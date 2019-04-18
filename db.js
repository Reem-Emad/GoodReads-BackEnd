var mongoose = require('mongoose');
const dbURL = process.env.Mongo_URL || 'mongodb://localhost:27017/GoodReads';

mongoose.connect(dbURL, { useNewUrlParser: true, autoIndex: true, useCreateIndex: true });

