const JWT = require('jsonwebtoken')
const removeObjectKeys = require('./removeObjectKeys')

module.exports = (user) => {
  const returnedUserData = removeObjectKeys(['password', 'email'], user.toObject())
  const token = JWT.sign(returnedUserData, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
  return {
    ...returnedUserData,
    token
  }
}

/** NOTE 
 * this function generate the token and returns the response of the user with the token in a single object
 * it makes the response clear and readable instead of adding the token manually
 */