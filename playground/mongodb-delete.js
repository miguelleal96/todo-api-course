// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connected to MongoDB server')

  // deleteMany - deletes all the docs that match criteria
  // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then(result => {
  //   console.log(result)
  // })

  // deleteOne - deletes only the first doc that matches criteria
  // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then(result => {
  //   console.log(result)
  // })

  // findOneAndDelete - takes the id as the creteria and returns the deleted doc in an obj
  // db.collection('Todos').findOneAndDelete({completed: false}).then(result => {
  //   console.log(result)
  // })

  db.collection('Users').deleteMany({name: 'Miguel'}).then(result => {
    console.log(result)
  })

  db.collection('Users').findOneAndDelete(
    {_id: new ObjectID("5998ac2f36b28a06e1f9532e")
  }).then(result => {console.log(result)})

  //db.close()
})