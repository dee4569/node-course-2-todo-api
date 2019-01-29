
var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });
 


// var db = {
//     localhost: 'mongodb://localhost:27017/TodoApp',
//     mlab: process.env.MONGODB_URI
// };
 
// mongoose.connect(db.localhost,
//     {
//         useNewUrlParser: true
//     }
// ).then(
//     () => {},
//     err => 
//     {
//         mongoose.connect(db.mlab,
//             {
//                 useNewUrlParser: true
//             }
//         );
//     }
// );
 
module.exports = {mongoose};

