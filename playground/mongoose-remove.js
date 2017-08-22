const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

/* Remove all docs in collection */
// Todo.remove({}).then(result => {
//   console.log(result)
// })

/* Remove one doc in collection */
// Todo.findOneAndRemove
// Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id: "599c6eb436b28a06e1f9b4d1"}).then(todo => {
//   console.log(todo)
// })

Todo.findByIdAndRemove('599c6eb436b28a06e1f9b4d1').then(todo => {
  console.log(todo)
})
