// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connected to MongoDB server')

  // db.collection('Todos').find({
  //   _id: new ObjectID("5998912cc046f2466c9a543f")
  // }).toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, null, 2))
  // }).catch(err => {
  //   console.log('Unable to fetch todos', err)
  // })

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`)
  // }).catch(err => {
  //   console.log('Unable to fetch todos', err)
  // })

  db.collection('Users').find({
    name: 'Miguel'
  }).toArray().then(docs => {
    console.log(JSON.stringify(docs, null, 2))
  })

  //db.close()
})