const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')
// const id = "599b3f05b78fa8176463ab326"

// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// Todo.find({
//   /* Mongoose coverts 'id' to an ObjectID behind the scenes*/
//   _id: id 
// }).then((todos) => {
//   console.log('Todos', todos)
// }) 

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log('Todo', todo) 
// })

// Todo.findById(id).then(todo => {
//   if(!todo) {
//     return console.log('Id not found')
//   }
//   console.log('Todo By Id', todo)
// }).catch(e => console.log(e))

const userID = "5999d096b834ff1e70e50087"
User.findById(userID).then(user => {
  if(!user) {
    return console.log('User not found')
  }
  console.log('User fetched', JSON.stringify(user, null, 2))
}).catch(e => console.log(e))

