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
        text: 'Second test todo',
        completed: true,
        completedAt: Date.now()
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

describe("DELETE /todo/:id",()=>{

    it("should delete a todo", (done)=>{
        var newObjextID = todos[0]._id.toHexString();
        request(app)
            .delete(`/todo/${newObjextID}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(newObjextID);
            })
        .end((err, res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(newObjextID).then((todo)=>{
                if(!todo){
                    expect(todo).toBeNull();
                    done();
                }
            }).catch((e)=>{done(e)});

        });
    });

    it("should return 404 with id not found", (done)=>{
        var newObjextID = new ObjectID().toHexString();
        request(app)
            .delete(`/todo/${newObjextID}`)
            .expect(404)
        .end(done);
    });

    it("should return 404 with invalid id", (done)=>{
        request(app)
            .delete(`/todo/12345122`)
            .expect(404)
            .end(done);
    });

});

describe("PATCH /todo/:id", ()=>{

    it("should update todo", (done)=>{
        var newObjectID = todos[1]._id.toHexString();
        var body = {completed: true, text: "updated text hehehhe"};
        request(app)
            .patch(`/todo/${newObjectID}`)
            .send(body)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBeTruthy();
            })
        .end(done);
    });

    it("should clear completedAt when todo is not completed", (done)=>{
        var newObjectID = todos[1]._id.toHexString();
        var body = {completed: false};
        request(app)
            .patch(`/todo/${newObjectID}`)
            .send(body)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBeNull();
            })
        .end(done);

    });


});


