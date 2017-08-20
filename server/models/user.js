const mongoose = require('mongoose')

/* Model for the User */
const User = mongoose.model('User', {
  email: {
    type: String,
    require: true,
    trim: true,
    minlength: 1
  }
})

module.exports = {User}