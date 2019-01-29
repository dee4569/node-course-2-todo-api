
var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

//to remove deprecated warning in mongoose when update is run
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false); 

module.exports = {mongoose};



