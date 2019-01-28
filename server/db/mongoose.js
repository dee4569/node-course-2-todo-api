var mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MongoDB_URI || 'mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

module.exports = {mongoose};