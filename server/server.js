/**
 * Created by Salman on 12/13/2017.
 */

const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(req, res)=>{
    var todoData = new Todo(
        {
            title: req.body.title,
            text: req.body.text,
            completed: false
        }
    );
    todoData.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
        //console.log('unable to save data:', err);
        res.status(400).send(err);
    });
});

app.get("/todos", (req, res)=>{
    Todo.find().then((todos)=>{
        res.send(todos);
    }, (err)=>{
        res.status(400).send(err);
    });
});

app.get("/todo/:id", (req, res)=>{
    var id  = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({error: "id is not valid"});
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send({error: "todo not found"});
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});


app.delete("/todo/:id", (req, res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({error: "id is not valid"});
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send({error: "todo id not found"});
        }
        res.send({todo});
    }).catch((e)=>{res.status(400).send({error:e})});
});


app.listen(port, ()=>{
   console.log(`App is started on port ${port}`);
});

module.exports = {app};

//
//
//var salmanData = new User({
//    name: 'Salman Yaqoob',
//    email: 'sy@in-hq.com'
//});
//
//salmanData.save().then((data)=>{
//    console.log('saved data:', data);
//},(err)=>{
//    console.log('error', err);
//});
//
//
//var todoData = new Todo(
//    {
//        title: "Salman task 2",
//        text: "Cooking food tonight",
//        completed: false
//    }
//);

//todoData.save().then((doc)=>{
//    console.log('data saved', doc);
//}, (err)=>{
//    console.log('unable to save data:', err);
//});