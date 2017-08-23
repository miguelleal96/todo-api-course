const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')
//const express = require('express')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

let todos = [{
  _id: new ObjectID(), 
	text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Secod test todo',
  completed: true,
  completedAt: 333
}]

/* lifecycle hook (code that runs before each test case) */
beforeEach(done => {
  /* empties Todo collection */
  Todo.remove({}).then(() => {
	  return Todo.insertMany(todos)
  }).then(() => done()) 
})

/* Test POST /todos ---------*/
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text'

    request(app)
      .post('/todos')
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
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(2)
			})
			.end(done)
	})
])

/* Test GET /todos/:id ---------*/
describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return a 404 if todo is not found', (done) => {
    const hexId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.findByIdAndRemove(hexId).then(todo => {
          expect(todo).toNotExist()
          done()
        }).catch(e => done(e))
      })
  })

  it('should return 404 if todo not found', done => {
    const hexId = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)    
  })

  it('should return 404 if object id is invalid', done => {
    request(app)
      .get('/todos/123')
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

  it('should clear completedAt when todo is not completed', done => {
    const hexId = todos[1]._id.toHexString() 
    const text ='This should be the new text!!'
    // grab id of first item
    request(app)
      .patch(`/todos/${hexId}`)
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