/**
 * Created by Salman on 12/10/2017.
 */
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'todoApp';

const updateTodo = function(db, filterObj, updateObj, optionsObj, callback) {
    // Get the documents collection
    const collection = db.collection('todos');
    // Find some documents
    collection.findOneAndUpdate(filterObj, updateObj, optionsObj).then((docs)=>{
        console.log("Update the following record");
        callback(docs);
    }, (err)=>{
        return console.log('unable to update the document, error', err);
    });
};

const updateUser = function(db, filterObj, updateObj, optionsObj, callback) {
    // Get the documents collection
    const collection = db.collection('Users');
    // Find some documents
    collection.findOneAndUpdate(filterObj, updateObj, optionsObj).then((docs)=>{
        console.log("Update the following record");
        callback(docs);
    }, (err)=>{
        return console.log('unable to update the document, error', err);
    });
};



MongoClient.connect(url, function(err, client) {
    if(err){
        return console.log('unable to connect to Database');
    }
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    var filterObj = { _id: new ObjectID("5a2d47a11a69d23868d5ea59")};
    var updateObj = {$set:{text: "salman is rocking now 123", completed: true }};
    var optionsObj = {returnOriginal: false};
    //updateTodo(db, filterObj, updateObj, optionsObj, (results)=>{
    //    console.log('update records:', results);
    //});

    filterObj = { _id: new ObjectID("5a30fbcf42b5b8d1699694da")};
    updateObj = {$set:{location: "Pakistan, Islamabad, Johar Town"}, $inc:{age:2}};
    optionsObj = {returnOriginal: false};

    updateUser(db, filterObj, updateObj, optionsObj, (results)=>{
        console.log('update records:', results);
    });



    //db.collection("todos").findOneAndUpdate(
    //    { _id: new ObjectID("5a2d47a11a69d23868d5ea59")},
    //    {$set:{text: "salman is rocking now", completed: true }},
    //    {returnOriginal: false}
    //).then((result)=>{
    //    console.log("Update the document result", result);
    //},(err)=>{
    //    console.log("found some error", err);
    //});

    client.close();
});
