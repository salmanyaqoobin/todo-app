/**
 * Created by Salman on 12/13/2017.
 */

require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');


var app = express();

const port = process.env.PORT;

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

app.patch("/todo/:id", (req, res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ["title", "text", "completed"]);

    if(!ObjectID.isValid(id)){
        res.status(404).send({error: "id not valid"});
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = Date.now();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
        if(!todo){
            res.status(404).send({error: "id not found"});
        }
        res.send({todo});
    }).catch((e)=>{res.status(400).send(e)});
});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ["name", 'email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

//GET users/me
app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
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