var mongoose = require('mongoose');
require('dotenv').config();

console.log(process.env.MongoDB_URI);
console.log(typeof(process.env.MongoDB_URI));

mongoose.Promise = global.Promise;
mongoose.connect((process.env.MongoDB_URI || 'mongodb://localhost:27017/TodoApp'), { useNewUrlParser: true });

module.exports = {mongoose};