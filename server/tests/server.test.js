const expect = require('expect')
const request = require('supertest')
//const express = require('express')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
	text: 'First test todo'
}, {
	text: 'Secod test todo'
}]

/* lifecycle hook (code that runs before each test case) */
beforeEach(done => {
  /* empties Todo collection */
  Todo.remove({}).then(() => {
	  return Todo.insertMany(todos)
  }).then(() => done()) 
})

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
