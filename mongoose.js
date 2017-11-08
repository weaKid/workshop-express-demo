const mongoose = require('mongoose');
const { url, useMongoClient } = require('./config/mongoose');

mongoose.connect(url, { useMongoClient });
mongoose.Promise = global.Promise;

module.exports = mongoose;
