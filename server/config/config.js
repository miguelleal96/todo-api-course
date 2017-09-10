const env = process.env.NODE_ENV || 'development'
console.log('env *****', env)

if(env === 'development' || env === 'test') {
  // automatically parses the json
  const config = require('./config.json')
  const envConfig = config[env]

  /*
    Object.keys(obj) - loops through object keys and returns them as an array
  */
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}

// if(env === 'development') {
//   process.env.PORT = 3000
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
// } else if (env === 'test') {
//   process.env.PORT = 3000
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
// }
