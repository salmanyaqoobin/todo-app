/**
 * Created by Salman on 12/13/2017.
 */

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require("mongodb");

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [
    {
        _id: new ObjectID(),
        title: 'First test todo',
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        title: 'Second test todo',
        text: 'Second test todo'
    }
];

beforeEach((done)=>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST /Todos', ()=>{

    it('should create new todos', (done)=>{
        var title = "First title";
        var text = "Test todo text";

        request(app)
            .post("/todos")
            .send({title, text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
        .end((err, res)=>{
            if(err){
                done(err);
            }

            Todo.find({text}).then((todo)=>{
                expect(todo.length).toBe(1);
                expect(todo[0].text).toBe(text);
                done();
            }).catch((e)=>{done(e)});

        });

    });

    it('should not create new todos', (done)=>{
        var title = "First title";
        var text = "Test todo text";

        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res)=>{
                if(err){
                    done(err);
                }
                Todo.find().then((todo)=>{
                    expect(todo.length).toBe(2);
                    done();
                }).catch((e)=>{done(e)});

            });

    });

});

describe('GET /todos', ()=>{

    it('Get all todos list', (done)=>{

        request(app)
            .get('/todos')
            .send({})
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(2)
            })
        .end(done);

    });

});

describe("GET /todo:id", ()=>{
    it("should get todo by id", (done)=>{
        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
        .end(done);
    });

    it("sholud get 404 if todo is not found", (done)=>{
        var newObjectID = new ObjectID();
        request(app)
            .get(`/todo/${newObjectID.toHexString()}`)
            .expect(404)
        .end(done)
    });

    it("sholud get 404 for non-object ID", (done)=>{
        var id = "123124swasd123";
        request(app)
            .get(`/todo/${id}`)
            .expect(404)
            .end(done)
    });

});




