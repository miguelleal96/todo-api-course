const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = '123abc!'

/*
  generate salt and add it to the hashed password
*/
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

const hashedPassword = '$2a$10$To8fzn4uBuizFjTVg20cBuAoaPjPDNveHGzqRo.yL4U1VkNlkhR66'

bcrypt.compare(password, hashedPassword, (err, result) => {
  // 'result' === true or false depending on the password comparison
  console.log(result)
})

// const data = {
//   id: 10
// }

// const token = jwt.sign(data, '123abc')
// console.log(token)
// const decoded = jwt.verify(token, '123abc')
// console.log('decoded', decoded)

// const message = 'I am user number 3'
// const hash = SHA256(message).toString()

// console.log(`message: ${message}`)
// console.log(`hash: ${hash}`) 

/* JWT */
// const data = {
//   id: 4
// }
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// if(resultHash === token.hash) {
//   console.log('Data was not changed')
// } else {
//   console.log('Data was changed. Do not trust!')
// }