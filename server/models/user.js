/*
  model methods - a method called on the model
    ex: User.findById()
  instance methods - a method called on the instance 
    ex: user.generateAuthToken()
*/
const mongoose = require('mongoose')
const validator = require('validator')
let jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({ 
  email: {
    type: String,
    require: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

/* ---- Mongoose Instance Methods ---- */

/* 
  Overriding the toJSON mongoose method
  Determines what is sent back when a mongoose 
  model is converted to a JSON value
*/
UserSchema.methods.toJSON = function() { 
  const user = this
  const userObject = user.toObject()

  /* returns a new object with only the _id and email properties */
  return _.pick(userObject, ['_id', 'email'])
}

/* "methods" on mongoose.Schema is an object */
/* custom method to generate auth token for new user */
UserSchema.methods.generateAuthToken = function() {
  // this === the individual document
  const user = this
  const access = 'auth'
  const token = jwt.sign({
    _id: user._id.toHexString(), 
    access
  }, 'abc123').toString()

  user.tokens.push({access, token})

  return user.save().then(() => {
    /* return "token" to chain promise on to this method */
    return token 
  })
}

/* ---- Mongoose Model Methods ---- */

/*
 UserSchema.statics is similar to 'methods' but allows
 us to create model methods instead of instance methods
*/
UserSchema.statics.findByToken = function(token) {
  // this === to the model
  const User = this
  let decoded

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch(e) {
    /* 
      return a rejected promise if token verification fails
      return new Promise((res, rej) => {
        rej()
      })
    */
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this
  return User.findOne({email}).then(user => {
    if(!user) return Promise.reject()

    return new Promise((resolve, reject) => {
      // use bcrypt.compare to compare password and user.password 
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user)
        } else {
          reject(err)
        }
      })
    })
  })
}

/* Mongoose Middleware */
UserSchema.pre('save', function(next) {
  const user = this
  /* 
    only hash password if modified 
  */
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

/* Model for the User */
const User = mongoose.model('User', UserSchema)

module.exports = {User}