require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var{Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

//setting up the port to listen to 
const port = process.env.PORT;

//to get the values that have been passed in the body
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        //text property is got from the bodys
        text: req.body.text
    });

    //saving the todo; and displaying the saved todo
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//getting all todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {

        //todos sent as an object
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

//todos got according to id
app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    //check to see if the id that has been passed is valid
    if(!ObjectID.isValid(id)){
        //if its not valid an error code is displayed
       return res.status(404).send();
    }

    //finds todos by id
    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndDelete(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        //sends the todo that was deleted as the response
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

//updates todos
app.patch('/todos/:id', (req, res) => {

    var id = req.params.id;

    //pick the attributes that you want
    var body = _.pick(req.body, ['text'], ['completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    //check if completed is a boolean and is true
    if(_.isBoolean(body.completed) && body.completed){
        //if so completedAt is given a time
        body.completedAt = new Date().getTime();
    }else{
        //sets the completed and completedAt values accordingly. if boolean is not specified
        //the completed property is set to false
        body.completed = false;
        body.completedAt = null;
    }

    //when updating you use the "$set" property and specify everything that needs to be set. 
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) =>{
        if(!todo){
            return res.status(400).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

// POST /users
app.post('/users', (req, res) => {
    //picking the eamil and password properties and passing it to the body variable
    var body =_.pick(req.body,['email'], ['password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then ((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    }); 
});

//authenticate middelware
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login (email, password)
app.post('/users/login', (req, res) => {
    var body =_.pick(req.body, ['email'], ['password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};