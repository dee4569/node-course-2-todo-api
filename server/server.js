var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    }
});

// var newTodo2 = new Todo({
//     text: 'Something to do'
// });

// newTodo2.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (e) => {
//     console.log('Unable to save todo', e)
// });

var User = mongoose.model('Users',{
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

var newUser = new User({
    email: " abc@gmail.com "
});

newUser.save().then((doc) => {
    console.log('Saved user', doc);
}, (e) => {
    console.log('Unable to save user', e);
})