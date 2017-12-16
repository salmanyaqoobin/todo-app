/**
 * Created by Salman on 12/16/2017.
 */
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const jwt = require('jsonwebtoken');

var userOneID = new ObjectID();
var userTwoID = new ObjectID();

const users = [
    {
        _id: userOneID,
        name: 'Salman 1',
        email: 'sy1@in-hq.com',
        password:"passwordUser1",
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userOneID, access:'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: userTwoID,
        name: 'Salman 2',
        email: 'sy2@in-hq.com',
        password:"passwordUser2"
    }
];

const todos = [
    {
        _id: new ObjectID(),
        title: 'First test todo',
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        title: 'Second test todo',
        text: 'Second test todo',
        completed: true,
        completedAt: Date.now()
    }
];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=>done());
};

const populateUsers = (done)=>{
    User.remove({}).then(()=> {
        //var userOne = new User(users[0]).save();
        //var userTwo = new User(users[1]).save();
        //return Promise().all([userOne, userTwo]);
        return User.insertMany(users);
    }).then(()=>done());
};


module.exports = {todos, populateTodos, users, populateUsers};
