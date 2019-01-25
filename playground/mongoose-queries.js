const {ObjectID} = require('mongodb');

const {mongoose} = require ('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

var id = '5c4735733a220734dc346c44';

User.findById(id).then((user) => {
    if(!user){
       return console.log('Unable to find user');
    }
    console.log('User by ID', user);
}).catch((e) => console.log(e));
// var id = '5c49d6a542400533d08c70de11';

// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }

// Todo.find({
//    _id: id 
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id 
//  }).then((todo) => {
//      console.log('Todo', todo);
//  });

//  Todo.findById(id).then((todo) => {
//      if(!todo){
//          return console.log('ID not found');
//      }
//     console.log('Todo By ID', todo);
// }). catch((e) => console.log(e));