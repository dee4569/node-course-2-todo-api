const {ObjectID} = require('mongodb');

const {mongoose} = require ('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// Todo.deleteMany({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndDelete({_id:'5c4fd7d1009d3cb35ce9d6be'}).then((todo) => {

});

Todo.findByIdAndDelete('5c4fd7d1009d3cb35ce9d6be').then((todo) => {
    console.log(todo);
});

