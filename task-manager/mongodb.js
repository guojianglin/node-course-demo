const { MongoClient, ObjectID } = require('mongodb');

// const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://localhost:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to the database');
    }

    const db = client.db(databaseName);

    // db.collection('users').insertOne({
    //     name: 'Peter',
    //     age: '25',
    // }, (error, result) => {
    //     if (error) {
    //         return console.log(error);
    //     }

    //     console.log(result.ops);
    // });

    // db.collection('users').insertMany([
    //     { name: 'Mary', age: '22' },
    //     { name: 'Bill', age: '25' }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log(error);
    //     }

    //     console.log(result.ops);
    // });

    // db.collection('tasks').insertMany([
    //     { description: 'Clean the house', completed: false,},
    //     { description: 'Buy the vegetables', completed: false}
    // ],(error, result) => {
    //     if (error) return console.log(error);

    //     console.log(result.ops)
    // })

    // db.collection('tasks').findOne({_id: new ObjectID('5ea389b7b87ef137e053a7ec')}, (error, tasks) => {
    //     if (error) return console.log(error);
    //     console.log(tasks);
    // })

    // db.collection('tasks').find({ completed: true }).toArray((error, tasks) => {
    //     if (error) return console.log(error);
    //     console.log(tasks);
    // })

    // db.collection('tasks').updateMany({completed: false}, {
    //     $set: {
    //         completed: true
    //     }
    // }).then(res => console.log(res)).catch(err => console.log(err))

    db.collection('tasks').deleteMany({ description: 'Clean the house'}).then(res => console.log(res)).catch(err => console.log(err))

})