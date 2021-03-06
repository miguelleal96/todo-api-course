const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')
//const express = require('express')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, 
      populateTodos, 
      users, 
      populateUsers} = require('./seed/seed')

/* lifecycle hook (code that runs before each test case) */
beforeEach(populateUsers)
beforeEach(populateTodos)

/* Test POST /todos ---------*/
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text'

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err,res) => {
        // err obj will be populated if any assertions fail
        if(err) {
          return done(err)
        }

        // assert if the todo was successfully added to the DB
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch(e => done(e)) 
      })
  })

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
				if(err) return done(err)
					
				// assert if the todo was not added to the DB
				Todo.find().then((todos) => {
					expect(todos.length).toBe(2)
					done()
				}).catch(e => done(e))
      })
  })
})

/* Test GET /todos ---------*/
describe('GET /todos', () => [
	it('should get all todos', (done) => {
		request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(1)
			})
			.end(done)
	})
])

/* Test GET /todos/:id ---------*/
describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should not return todo doc created by other users', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return a 404 if todo is not found', (done) => {
    const hexId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

/* Test DELETE ---------*/
describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    const hexId = todos[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.findById(hexId).then(todo => {
          expect(todo).toNotExist()
          done()
        }).catch(e => done(e))
      })
  })

  it('should remove a todo', done => {
    const hexId = todos[0]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.findById(hexId).then(todo => {
          expect(todo).toExist()
          done()
        }).catch(e => done(e))
      })
  })

  it('should return 404 if todo not found', done => {
    const hexId = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done)    
  })

  it('should return 404 if object id is invalid', done => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

/* Test PATCH ---------*/
describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    const hexId = todos[0]._id.toHexString() 
    const text ='This should be the new text'
    // grab id of first item
    request(app)
      .patch(`/todos/${hexId}`)
      // auth as first user
      .set('x-auth', users[0].tokens[0].token)
      .send({ /* Sends data to patch with */
        // update text, set complete true
        completed: true,
        text
      })
    // 200
      .expect(200)
      .expect(res => {
        // text is changed, completed is true, completedAt is a number .toBeA
        //console.log(res)
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)
  })

  it('should not update the todo created by other user', done => {
    const hexId = todos[0]._id.toHexString() 
    const text ='This should be the new text'
    // grab id of first item
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({ /* Sends data to patch with */
        // update text, set complete true
        completed: true,
        text
      })
      .expect(404)
      .end(done)
  })

  it('should clear completedAt when todo is not completed', done => {
    const hexId = todos[1]._id.toHexString() 
    const text ='This should be the new text!!'
    // grab id of first item
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({ /* Sends data to patch with */
        // update text, set complete true
        completed: false,
        text
      })
    // 200
      .expect(200)
      .expect(res => {
        // text is changed, completed false, completedAt is null .toNotExist
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completeAt).toNotExist()
      })
      .end(done)
  })
})

describe('GET /user/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token) /* set header */
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('should create a user', done => {
    const email = 'example@example.com'
    const password = '123mnb!'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if(err) return done(err)
        // check if the user is in the database
        User.findOne({email}).then(user => {
          expect(user).toExist()
          // check if the passwords are getting hashed
          expect(user.password).toNotBe(password)
          done()
        }).catch(e => done(e))
      })
  })

  it('should return validation errors if request invalid', done => {
    const email = 'invalidEmail'
    const password = '1'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  })

  it('should not create user if email in use', done => {
    const email = users[0].email
    const password = users[0].password
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  })
})

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.header['x-auth']).toExist()
      })
      .end((err, res) => {
        if(err) return done(err)

        User.findById(users[1]._id).then(user => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.header['x-auth']
          })
          done()
        }).catch(e => done(e))
      })
  })

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect(res => {
        expect(res.header['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if(err) return done(err)
        User.findById(users[1]._id).then(user => {
          expect(user.tokens.length).toBe(1)
          done()
        }).catch(e => done(e))
      })
  })
})

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) return done(err)

        User.findById(users[0]._id).then(user => {
          expect(user.tokens.length).toBe(0)
          done()
        }).catch(e => done(e))
      })
  })
})