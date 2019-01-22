// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => { 
    if(err){
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c471fb4ba2bc6984d1711f2')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c45fe0e7dba6321ec941122')
    }, {
        $set:{
            name: 'Katerina'
        },
        $inc:{
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) =>{
        console.log(result);
    });

    //client.close();
});