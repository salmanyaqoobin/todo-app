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

app.post('/todos',authenticate, (req, res)=>{
    var todoData = new Todo(
        {
            title: req.body.title,
            text: req.body.text,
            completed: false,
            _creator: req.user._id
        }
    );
    todoData.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
        //console.log('unable to save data:', err);
        res.status(400).send(err);
    });
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

app.get("/todo/:id", authenticate, (req, res)=>{
    var id  = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({error: "id is not valid"});
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send({error: "todo not found"});
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});


app.delete("/todo/:id", authenticate, (req, res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({error: "id is not valid"});
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send({error: "todo id not found"});
        }
        res.send({todo});
    }).catch((e)=>{res.status(400).send({error:e})});
});

app.patch("/todo/:id", authenticate, (req, res)=>{
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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo)=>{
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

// POST /users/login
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, [ 'email', 'password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
        if(!user){
            return res.status(404).send();
        }
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send(e);
    });
});


//DELETE /users/me/token

app.delete('/users/me/token', authenticate, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch((e)=>{
        res.status(400).send(e);
    });

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