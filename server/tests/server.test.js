const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID,
    text: "First test todo"
}, {
    _id: new ObjectID,
    text: "Second test todo",
    completed:true,
    completedAt:333
}];

//before each test case is run the database is wiped and the todos that were defined inserted back into the db
beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        
        request(app)
         .post('/todos')
         //sending the text object
         .send({text})
         //expecting status code to be 200
         .expect(200)
        //some expectations about the response body
         .expect((res) => {
            expect(res.body.text).toBe(text);
         })

         .end((err, res) =>{
            if(err) {
                return done(err);
            }

            //because just one todo is added the todos.length will be 1
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
         });
    });

    it('should not create todo with invalid body data', (done) => {
        var text = ' ';
        
        request(app)
         .post('/todos')
         .send({text})
         .expect(400)
         .end((err, res) =>{
            if(err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
         });       
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
    //  var _id = new ObjectID;
        request(app)
        .get(`/todos/${hexId}`)
        //.get(`/todos/${_id.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        id = "1234";
        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todo/:id', () =>{
    it('should remove a todo', (done) => {
        //objectID is not a string value therfore to convert to a string you have to use tohexstring method
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);    
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });

    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if objectid is invalid', (done) => {
        id = "1234";
        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
});

describe('Patch /todos/:id',() => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var body = {
            text: "This should be the new text",
            completed:true
        };

        request(app)
        .patch(`/todos/${hexId}`)
        .send(body)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof(res.body.todo.completedAt)).toBe('number');
            done();
        }).catch((e) => done(e));
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var body = {
            text:"Updated",
            completed: false
        };

        request(app)
        .patch(`/todos/${hexId}`)
        .send(body)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
            done();
        }).catch((e) => done(e));
    });
});