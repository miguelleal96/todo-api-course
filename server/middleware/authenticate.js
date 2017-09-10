const {User} = require('./../models/user')

/* 
  middleware to authenticate routes
*/
const authenticate = (req, res, next) => {
  // get the token from the header of the request
  const token = req.header('x-auth')

  User.findByToken(token).then(user => {
    if (!user) return Promise.reject()
    // populate the req object with the user and token info
    req.user = user
    req.token = token
    next()
  }).catch(e => {
    res.status(401).send()
  })
}
 
module.exports = {authenticate}