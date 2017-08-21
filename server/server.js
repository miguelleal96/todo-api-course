const express = require('express')
const bodyParser = require('body-parser')

const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

const app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })

  todo.save().then(doc => {
    res.send(doc)
  }).catch(e => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }).catch(e => {
    res.status(400).send(e)
  })
})

// GET /todos/12345
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  // valid id using isValid
    //404 - send back empty send
  if(!ObjectID.isValid(id)){
    console.log('Id is not valid')
    res.status(404).send()
  }
  //findById
    Todo.findById(id).then(todo => {
      // success
      // if no todo - send back 404 with empty body
      if(!todo) {
        console.log('no todo found')
        return res.status(404).send()
      }
      // if todo - send it back
      res.send({todo})
    }).catch(e => {
      // error
        // 400 - and send empty body back
      res.status(400).send()
      console.log('promise failed')
      console.log(e)
    })
})

app.listen(3000, () => {
  console.log('Started on port 3000')
})

module.exports = {app}


