/**
 * Created by Salman on 12/10/2017.
 */
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'todoApp';


const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('todos');
    // Find some documents
    collection.find({_id: new ObjectID("5a2d46f389c8b95d0094e718")}).toArray(function(err, docs) {
        if(err){
            return console.log('unable to find collection');
        }
        console.log("Found the following records");
        callback(docs);
    });
};

const findDocumentsByName = function(db, findObj, callback) {
    // Get the documents collection
    const collection = db.collection('Users');
    // Find some documents
    collection.find(findObj).toArray().then((docs)=>{
        console.log("Found the following records");
        callback(docs);
    }, (err)=>{
        return console.log('unable to find collection, error', err);
    });
};

const countDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('todos');
    // Find some documents
    collection.find().count().then((docs)=>{
        console.log("Found the following records");
        callback(docs);
    }, (err)=>{
        return console.log('unable to find collection');
    });
};

MongoClient.connect(url, function(err, client) {
    if(err){
        return console.log('unable to connect to Database');
    }
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    //findDocuments(db, (docs)=>{
    //    console.log(JSON.stringify(docs, undefined, 2));
    //});

    //countDocuments(db, (docs)=>{
    //    console.log(JSON.stringify(docs, undefined, 2));
    //});

    var findObj = {name: "Salman Yaqoob"};

    findDocumentsByName(db, findObj, (docs)=>{
        console.log(JSON.stringify(docs, undefined, 2));
    });


    client.close();
});
