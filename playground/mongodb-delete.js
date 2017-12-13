/**
 * Created by Salman on 12/10/2017.
 */
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'todoApp';

MongoClient.connect(url, function(err, client) {
    if(err){
        return console.log('unable to connect to Database');
    }
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    //deleteMany
    //db.collection('todos').deleteMany({text: "Salman text 3"}).then((result)=>{
    //    console.log(result);
    //});

    //deleteOne
    //db.collection('todos').deleteOne({text: "Salman text 3"}).then((result)=>{
    //    console.log(result);
    //});

    //findOneAndDelete
    db.collection('todos').findOneAndDelete({text: "Salman text 3"}).then((result)=>{
        console.log(result);
    });


    client.close();
});
