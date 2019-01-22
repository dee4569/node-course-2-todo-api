var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed:{
        type: Boolean
    },
    completedAt:{
        type: Number
    }
});

var newTodo = new Todo({
    text: 'Cook dinner'
});

var newTodo2 = new Todo({
    text: 'Buy groceries',
    completed: true,
    completedAt: 5
});

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc)
// }, (e) => {
//     console.log("Unable to save todo")
// });

newTodo2.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Unable to save todo')
});