const JWT = require('jsonwebtoken')
const statusText = require('../config/statusText.config')
const AppError = require('../utils/appError')
const appError = new AppError()

module.exports = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers['authorization']
  if (!authHeader) {
    appError.create(401, statusText.ERROR, 'token is required')
    return next(appError)
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)
    // apply the user data from the token
    req.user = decoded
    next()
  } catch (error) {
    console.log('verify token middleware error', error)
    appError.create(400, statusText.ERROR, error.message)
    return next(appError)
  }
}