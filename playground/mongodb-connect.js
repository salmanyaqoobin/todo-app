/**
 * Created by Salman on 12/10/2017.
 */
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'todoApp';

// Use connect method to connect to the server
//MongoClient.connect(url, function(err, client) {
//    if(err){
//        return console.log('unable to connect to Database');
//    }
//    console.log("Connected successfully to server");
//
//    const db = client.db(dbName);
//    db.collection('todos').insertOne({
//        text: "Salman text",
//        completed: false
//    }, (err, result)=>{
//        if(err){
//            return console.log('Unable to add data');
//        }
//
//        console.log(JSON.stringify(result.ops, undefined, 2));
//
//    });
//
//    client.close();
//});

MongoClient.connect(url, function(err, client) {
    if(err){
        return console.log('unable to connect to Database');
    }
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    db.collection('Users').insertOne({
        name: "Salman Yaqoob",
        age:32,
        location: "Riyadh, Malaz"
    }, (err, result)=>{
        if(err){
            return console.log('Unable to add data');
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());

    });
    client.close();
});



