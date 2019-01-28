var mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MongoDB_URI, { useNewUrlParser: true });

module.exports = {mongoose};