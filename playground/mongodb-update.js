// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connected to MongoDB server')

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5998a99036b28a06e1f951c3") 
  // }, {
  //   $set: { /* Update Operators */
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then(result => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate({ /* filter */
    // _id: new ObjectID("59989d5dc6597147c09e0f6b"),
    name: "Julio"
  }, { /* Update with update operators */
    $inc: {
      age: 1
    },
    $set: {
      name: "Miguel"
    }
  }, { /* options */
    returnOriginal: false
  }).then(result => {
    console.log(result)
  })

  //db.close()
})