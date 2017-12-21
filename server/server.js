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

const bcrypt = require('bcryptjs');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',authenticate, async (req, res)=>{

    try {
        const todoData = new Todo(
            {
                title: req.body.title,
                text: req.body.text,
                completed: false,
                _creator: req.user._id
            }
        );
        const todo = await todoData.save();
        res.send(todo);

    } catch (e){
        res.status(400).send(e);
    }
});

app.get("/todos", authenticate, (req, res)=>{
    Todo.find({
        _creator: req.user._id
    }).then((todos)=>{
        res.send(todos);
    }, (err)=>{
        res.status(400).send(err);
    });
});

app.get("/todo/:id", authenticate, async (req, res)=>{
    const id  = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({error: "id is not valid"});
    }

    try {
        const todo= await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });
        if(!todo){
            return res.status(404).send({error: "todo not found"});
        }
        res.send({todo});

    } catch (e){
        res.status(400).send(e);
    }
});


app.delete("/todo/:id", authenticate, async (req, res)=>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({error: "id is not valid"});
    }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        if(!todo){
            return res.status(404).send({error: "todo id not found"});
        }
        res.send({todo});
    } catch (e){
        res.status(400).send({error:e});
    }

});

app.patch("/todo/:id", authenticate, async (req, res)=>{
    const id = req.params.id;
    const body = _.pick(req.body, ["title", "text", "completed"]);

    try {

        if(!ObjectID.isValid(id)){
            return res.status(404).send({error: "id not valid"});
        }

        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = Date.now();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {$set: body}, {new: true}).catch((e)=>{
            res.status(404).send({error: "id not found"});
        });

        if(!todo){
            return res.status(404).send({error: "id not found"});
        }
        res.send({todo});

    } catch (e){
        res.status(400).send(e);
    }

});

// POST /users
app.post('/users', async (req, res) => {

    try {
        const body = _.pick(req.body, ["name", 'email', 'password']);
        const user = new User(body);

        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e){
        res.status(400).send(e);
    }
});

//GET users/me
app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
});

// POST /users/login
app.post('/users/login', async (req, res) => {

    const body = _.pick(req.body, [ 'email', 'password']);
    try {
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e){
        res.status(400).send(e);
    }
});


//DELETE /users/me/token
app.delete('/users/me/token', authenticate, async (req, res)=>{
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e);
    }
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