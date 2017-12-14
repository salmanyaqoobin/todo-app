/**
 * Created by Salman on 12/14/2017.
 */

const {ObjectID} = require('mongodb');
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");


//Todo.remove({}).then((result)=>{
//    console.log(result);
//});
//
//
//Todo.findOneAndRemove({_id: 'sadsad'}).then((doc)=>{
//    console.log(doc);
//});

//Todo.findByIdAndRemove("5a326e5f045ae4c17369b68c").then((todo)=>{
//    console.log(todo);
//});