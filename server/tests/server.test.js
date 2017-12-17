/**
 * Created by Salman on 12/13/2017.
 */

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require("mongodb");

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos,  users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', ()=>{
    it('should be valid user header', (done)=>{
        request(app)
            .get("/users/me")
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 for un-authorized user', (done)=>{
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
    });

});

describe('POST /users', ()=>{
    it('should create user',(done)=>{
        var name = "salman";
        var email = "email@email.com";
        var password = "passwordabc123";

        request(app)
            .post("/users")
            .send({name, email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.header).toHaveProperty('x-auth');
                expect(res.body).toHaveProperty('_id');
                expect(res.body.email).toBe(email);
            })
        .end((err)=>{
            if(err){
                return done(err);
            }

            User.findOne({email}).then((user)=>{
                expect(user).not.toBeNull();
                expect(user.email).toEqual(email);
                expect(user.password).not.toEqual(password);
                done();
            }).catch((e)=>{
                done(e);
            });

        });


    });

    it('should not create user with invalid data',(done)=>{
        request(app)
            .post("/users")
            .send({name:"salman", email:'sxample', password:'asd'})
            .expect(400)
            .expect((res)=>{
            })
            .end(done);
    });

    it('should not create user, if email already created',(done)=>{
        request(app)
            .post("/users")
            .send({name:"salman", email:users[0].email, password:'123465432125'})
            .expect(400)
            .expect((res)=>{
            })
            .end(done);
    });
});

describe("POST /users/login", ()=>{

    it("should login user with valid credentials", (done)=>{

        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers).toHaveProperty('x-auth');
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user)=>{
                    var newObject = new Object({
                        _id:user.tokens[0]._id,
                        access: "auth",
                        token: res.headers['x-auth']
                    });
                    expect(user.tokens[0].access).toEqual("auth");
                    expect(user.tokens[0]._id).toEqual(user.tokens[0]._id);
                    expect(user.tokens[0].token).toEqual(res.headers['x-auth']);
                    done();
                }).catch((e)=>{
                    done(e);
                });
            });
    });

    it("should reject invalid login credentials", (done)=>{
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password+" 1"
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers).not.toHaveProperty('x-auth');
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                done();
            });
    });


});

describe("DELETE /users/me/token", ()=>{

    it("should logout with valid token", (done)=>{
        request(app)
            .delete("/users/me/token")
            .set({'x-auth': users[0].tokens[0].token})
            .expect(200)
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                User.findById(users[0]._id).then((user)=>{
                    if(!user){
                        return done({error:"user not find with id"});
                    }
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=>{done(e);});
            });
    });

});


