/**
 * Created by Salman on 12/14/2017.
 */

const {ObjectID} = require('mongodb');
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

var id = "5a3195bd4757ea622c91d308";

//if(!ObjectID.isValid(id)){
//    console.log("Id is not valid");
//}


//Todo.find({_id: id}).then((todos)=>{
//    console.log(todos);
//});
//
//Todo.findOne({_id: id}).then((todos)=>{
//    console.log(todos);
//});


//Todo.findById(id).then((todos)=>{
//    if(!todos){
//        return console.log('ID is not found');
//    }
//    console.log(todos);
//}).catch((e)=>console.log(e));

var userID = "5a324426222ff233a823bae7";

User.findById(userID).then((users)=>{
    if(!users){
        return console.log('ID is not found');
    }
    console.log(users);
}).catch((e)=>console.log(e));
