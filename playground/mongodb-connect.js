// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connected to MongoDB server')

  /* Insert Document to 'Todos' collection */
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err)
  //   }

  //   console.log(JSON.stringify(result.ops, null, 2))
  // })

  //Insert new doc into Users (name, age, location)
  // db.collection('Users').insertOne({
  //   name: 'Miguel',
  //   age: 21,
  //   location: 'Arlington TX'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert user', err)
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), null, 2))
  // })





  db.close()
})