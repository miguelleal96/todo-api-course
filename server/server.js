require('./config/config')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save().then(doc => {
    res.send(doc)
  }).catch(e => {
    res.status(400).send(e)
  })
})

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    /* only find the todos belonging to a certain user */
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos})
  }).catch(e => {
    res.status(400).send(e)
  })
})

// GET /todos/12345
app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id
  // valid id using isValid
    //404 - send back empty send
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
    // success
    // if no todo - send back 404 with empty body
    if(!todo) {
      //console.log('no todo found')
      return res.status(404).send()
    }
    // if todo - send it back
    res.send({todo})
  }).catch(e => {
    // error
      // 400 - and send empty body back
    res.status(400).send()
    //console.log('promise failed')
    //console.log(e)
  })
})

app.delete('/todos/:id', authenticate, (req, res) => {
  // get the id
  const id = req.params.id
  // validate the id -> not valid? return 404
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  // remove todo by id
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
    // success
      if(!todo) {
        // if no doc, send 404
        return res.status(404).send()
      } 
      // if doc, send doc back with 200
      res.status(200).send({todo})
  }).catch(e => {
    // error
      // 400 with empty body
    res.status(400).send()
  })
})

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id
  /* Picks out the 'text' and 'completed' property from req.body 
    to keep user from updating other properties like 'completedAt'*/
  const body = _.pick(req.body, ['text', 'completed'])

  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  // Sets the 'completedAt' property
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then(todo => {
    if(!todo) return res.status(404).send()
    res.send({todo})
  }).catch(e => res.status(400).send())
})

// POST /users
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  const user = new User(body)

  user.save()
    .then(() => {
      return user.generateAuthToken()
    })
    /* send the token back as a header on the response */
    .then(token => {
      res.header('x-auth', token).send(user)
    })
    .catch(e => res.status(400).send(e))
})  

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  User.findByCredentials(body.email, body.password).then(user => {
    // generate auth token and send back in header
    return user.generateAuthToken().then(token => {
      // .send(user) is to send back 'user' object on res.body
      res.header('x-auth', token).send(user)
    })
  }).catch(e => {
    console.log(e)
    res.status(400).send()
  })
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch(e => res.status(400).send)
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app}


