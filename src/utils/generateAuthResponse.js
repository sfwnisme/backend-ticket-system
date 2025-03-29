const JWT = require('jsonwebtoken')

module.exports = (user) => {
  const token = JWT.sign({ _id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
  const userObj = user.toObject()
  delete userObj.password

  return {
    ...userObj,
    token
  }
}

/**NOTE
 * this function generate the token and returns the response of the user with the token in a single object
 * it makes the response clear and readable instead of adding the token manually
 */